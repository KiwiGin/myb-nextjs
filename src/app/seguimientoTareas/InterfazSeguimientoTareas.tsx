"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { Proyecto, ProyectoTecnico } from "@/models/proyecto";
import { useEffect, useState } from "react";
import { z } from "zod";
import { InterfazSeguimientoTareasReparacion } from "./InterfazSeguimientoTareasReparacion";
import { format } from "path";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { InterfazNoTareasAsignadas } from "./InterfazNoTareasAsignadas";
import { InterfazSeguimientoTareasPintado } from "./InterfazSeguimientoTareasPintado";

const resultadosSchema = z.object({
  idParametro: z.number(),
  resultadoTecnico: z.number(),
  resultadoSupervisor: z.number(),
});

const feedbackResultadosSchema = z.object({
  idFeedback: z.number(),
  aprobado: z.boolean(),
  comentario: z.string(),
  resultados: z.array(resultadosSchema),
});

const especificacionSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidad: z.string(),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.valorMaximo === undefined && val.valorMinimo === undefined) {
      ["valorMaximo", "valorMinimo"].forEach((key) => {
        ctx.addIssue({
          code: "custom",
          message: "Debe existir un valor maximo o minimo.",
          path: [key],
        });
      });

      return z.NEVER;
    }
  });

const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  nombre: z.string(),
  especificaciones: z.array(especificacionSchema).optional(),
});

const proyectoSchema = z.object({
  idProyecto: z.number(),
  titulo: z.string(),
  cliente: z.object({
    idCliente: z.number(),
    nombre: z.string(),
  }),
  descripcion: z.string(),
  idEtapaActual: z.number(),
  etapaActual: z.string(),
  pruebas: z.array(pruebaSchema).optional(),
  feedback: feedbackResultadosSchema.optional(),
});

export function InterfazSeguimientoTareas() {
  const [idEmpleado, setIdEmpleado] = useState<string>("1");
  const [proyecto, setProyecto] = useState<ProyectoTecnico | null>(null);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando tareas...",
  });

  const fetchTareas = async () => {
    /* Obtener el proyecto al que esta asigando el empleado
    const res = await fetch(`/api/proyecto/por-id/${idEmpleado}`);
    const data = await res.json();
     */

    const data = {
      idProyecto: 1,
      titulo: "Proyecto de prueba",
      cliente: {
        idCliente: 1,
        nombre: "Cliente de prueba",
      },
      descripcion: "Descripcion de prueba",
      idEtapaActual: 3,
      etapaActual: "Etapa 1",
      pruebas: [
        {
          idTipoPrueba: 1,
          nombre: "Prueba de prueba",
          especificaciones: [
            {
              idParametro: 1,
              nombre: "Parametro de prueba",
              unidad: "Unidad de prueba",
              valorMaximo: 10,
              valorMinimo: 1,
            },
          ],
        },
      ],
      feedback: {
        idFeedback: 1,
        aprobado: true,
        comentario: "Comentario de prueba",
        resultados: [
          {
            idParametro: 1,
            resultadoTecnico: 5,
            resultadoSupervisor: 20,
          },
        ],
      },
    };

    /* const data = { message: "no_proyecto" }; */

    if (data.message && data.message === "no_proyecto") {
      return;
    }

    const parsedData = proyectoSchema.safeParse(data);

    if (parsedData.success) {
      console.log(parsedData.data);
      setProyecto(parsedData.data);
    } else {
      console.error(parsedData.error);
      throw new Error("Error al cargar el proyecto");
    }
  };

  useEffect(() => {
    fetchTareas()
      .catch((error) => {
        if (error instanceof Error)
          setNoice({ type: "error", message: error.message });
        else setNoice({ type: "error" });
        console.error(error);
      })
      .finally(() => {
        setNoice(null);
      });
  }, []);

  if (noice) return <Noice noice={noice} />;

  return proyecto ? (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <ProyectoHeader proyecto={proyecto} />
      <ProjectFlow etapa={Number(proyecto.idEtapaActual) - 1} />
      {proyecto.idEtapaActual == 3 ? (
        <div className="w-full">
          <InterfazSeguimientoTareasReparacion
            idEmpleado={idEmpleado}
            proyecto={proyecto}
          />
        </div>
      ) : proyecto.idEtapaActual == 4 ? (
        <div className="w-full p-7">
          <h1 className="text-center font-bold text-xl">En control de calidad...</h1>
        </div>
      ) : proyecto.idEtapaActual == 7 ? (
        <div className="w-full">
          <InterfazSeguimientoTareasPintado
            proyecto={proyecto}
            idEmpleado={idEmpleado}
          />
        </div>
      ) : null}
    </div>
  ) : (
    <InterfazNoTareasAsignadas />
  );
}
