"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { ProyectoSupervisor } from "@/models/proyecto";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";

const especificacionSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidad: z.string(),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional(),
    resultado: z.union([z.number(), z.string()]),
    resultadoTecnico: z.union([z.number(), z.string()]),
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
  especificaciones: z.array(especificacionSchema),
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
  pruebas: z.array(pruebaSchema),
  aprobado: z.boolean(),
  comentario: z.string().optional(),
});

export function InterfazVerificacionResultado() {
  const [idEmpleado, setIdEmpleado] = useState<string>("1");
  const [proyecto, setProyecto] = useState<ProyectoSupervisor | null>(null);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando reparación a revisar...",
  });

  const fetchReparacion = async () => {
    /* Obtener el proyecto al que esta asigando el empleado
    const res = await fetch(`/api/proyecto/por-id/${idEmpleado}`);
    const data = await res.json();
     */

    //obtenido por el fetch
    const data = {
      idProyecto: 1,
      titulo: "Proyecto de prueba",
      cliente: {
        idCliente: 1,
        nombre: "Cliente de prueba",
      },
      descripcion: "Descripcion de prueba",
      idEtapaActual: 4,
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
              resultadoTecnico: 5,
            },
          ],
        },
      ],
    };

    /* const data = { message: "no_proyecto" }; */

    if (data.message && data.message === "no_proyecto") {
      return;
    }

    const formattedPruebas = data.pruebas.map((prueba) => {
      const especificaciones = prueba.especificaciones?.map((espec) => {
        return {
          ...espec,
          resultado: Number(espec.valorMaximo) - Number(espec.valorMinimo),
        };
      });

      return {
        ...prueba,
        especificaciones,
      };
    });

    const formattedProyecto = {
      ...data,
      pruebas: formattedPruebas,
      aprobado: false,
    };

    const parsedData = proyectoSchema.safeParse(formattedProyecto);

    if (parsedData.success) {
      console.log(parsedData.data);
      setProyecto(parsedData.data);
    } else {
      console.error(parsedData.error);
      throw new Error("Error al cargar la reparación a revisar");
    }
  };

  useEffect(() => {
    fetchReparacion()
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
      {proyecto.idEtapaActual == 4 ? (
        <div className="w-full">
          <h1>Pruebas</h1>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <h1 className="text-2xl font-bold">No hay reparaciones por revisar</h1>
    </div>
  );
}
