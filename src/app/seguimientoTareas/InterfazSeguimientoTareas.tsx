"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { Proyecto } from "@/models/proyecto";
import { useEffect, useState } from "react";
import { z } from "zod";
import { InterfazSeguimientoTareasReparacion } from "./InterfazSeguimientoTareasReparacion";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { InterfazNoTareasAsignadas } from "./InterfazNoTareasAsignadas";
import { InterfazSeguimientoTareasPintado } from "./InterfazSeguimientoTareasPintado";
import MyBError from "@/lib/mybError";

const proyectoSchema = z.object({
  idProyecto: z.number(),
  titulo: z.string(),
  descripcion: z.string(),

  idEtapaActual: z.number(),
  etapaActual: z.string(),

  cliente: z.object({
    idCliente: z.number(),
    nombre: z.string(),
  }),

  supervisor: z.object({
    idEmpleado: z.number(),
    nombre: z.string(),
  }),

  jefe: z.object({
    idEmpleado: z.number(),
    nombre: z.string(),
  }),

  repuestos: z.array(
    z.object({
      idRepuesto: z.number(),
      nombre: z.string(),
      descripcion: z.string(),
      linkImg: z.string().optional().nullable(),
      cantidad: z.number(),
    })
  ),

  especificaciones: z.array(
    z.object({
      idParametro: z.number(),
      nombre: z.string(),
      valorMaximo: z.number(),
      valorMinimo: z.number(),
    })
  ),

  resultados: z.array(
    z.object({
      idResultadoPrueba: z.number(),
      idProyecto: z.number(),
      idEmpleado: z.number(),
      fecha: z.string(),
      resultados: z.array(
        z.object({
          idTipoPrueba: z.number(),
          resultadosParametros: z.array(
            z.object({
              idParametro: z.number(),
              nombre: z.string(),
              unidades: z.string(),
              resultado: z.number(),
            })
          ),
        })
      ),
    })
  ),

  empleadosActuales: z.array(
    z.object({
      idEmpleado: z.number(),
      nombre: z.string(),
    })
  ),
});

export function InterfazSeguimientoTareas() {
  const [idEmpleado] = useState<string>("5");
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando tareas...",
  });

  const fetchTareas = async () => {
    try {
      const res = await fetch(`/api/proyecto/por-id/${1}`);
      const data = await res.json();
      console.log("data", data);

      const parsedData = proyectoSchema.safeParse(data);

      if (parsedData.success) {
        setProyecto(parsedData.data);
      } else {
        throw new MyBError("Error al cargar el proyecto");
      }

      setNoice(null);
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error", message: "Error al cargar las tareas" });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTareas();
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
          <h1 className="text-center font-bold text-xl">
            En control de calidad...
          </h1>
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
