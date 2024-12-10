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
import { useSession } from "next-auth/react";

const proyectoSchema = z.object({
  idProyecto: z.number(),
  titulo: z.string(),
  descripcion: z.string(),

  idEtapaActual: z.number(),
  etapaActual: z.string(),

  fechaInicio: z.date(),
  fechaFin: z.date(),

  cliente: z.object({
    idCliente: z.number(),
    nombre: z.string(),
    ruc: z.string(),
    direccion: z.string(),
    telefono: z.string(),
    correo: z.string(),
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
      precio: z.number(),
      nombre: z.string(),
      descripcion: z.string(),
      linkImg: z.string().optional(),
      cantidad: z.number(),
    })
  ),

  especificaciones: z.array(
    z.object({
      idTipoPrueba: z.number(),
      nombre: z.string(),
      parametros: z.array(
        z.object({
          idParametro: z.number(),
          nombre: z.string(),
          unidades: z.string(),
          valorMaximo: z.number(),
          valorMinimo: z.number(),
        })
      ),
    })
  ).nullable(),

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
  ).nullable(),

  feedbacks: z.array(
    z.object({
      idFeedback: z.number(),
      idResultadoPruebaTecnico: z.number(),
      idResultadoPruebaSupervisor: z.number(),
      aprobado: z.boolean(),
      comentario: z.string(),
    })
  ).nullable(),

  empleadosActuales: z.array(
    z.object({
      idEmpleado: z.number(),
      nombre: z.string(),
      apellido: z.string(),
      correo: z.string(),
      telefono: z.string(),
      direccion: z.string(),
      rol: z.string(),
      linkImg: z.string().optional(),
    })
  ).nullable(),
})

export function InterfazSeguimientoTareas() {
  const [idEmpleadoMock] = useState<string>("5");
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando tareas...",
  });

  const { data: session, status } = useSession();

  const fetchTareas = async () => {
    try {
      const res = await fetch(`/api/proyecto/por-tecnico/${session?.user?.id}`);
      let data = await res.json();

      if (data == null) {
        setProyecto(null);
        setNoice(null);
        return;
      }

      data = {
        ...data,
        fechaInicio: new Date(`${data.fechaInicio}T00:00:00`),
        fechaFin: new Date(`${data.fechaFin}T00:00:00`),
      }

      const parsedData = proyectoSchema.safeParse(data);

      if (parsedData.success) {
        setProyecto(parsedData.data);
      } else {
        console.error(parsedData.error.errors);
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
    if (status === "loading") return;
    fetchTareas();
  }, [status]);

  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      {noice ? (
        <Noice noice={noice} />
      ) : proyecto ? (
        <>
          <ProyectoHeader proyecto={proyecto} showSeeDetailsBtn={true} />
          <ProjectFlow etapa={Number(proyecto.idEtapaActual) - 1} />
          {proyecto.idEtapaActual == 3 ? (
            <InterfazSeguimientoTareasReparacion
              idEmpleado={Number(idEmpleadoMock)}
              proyecto={proyecto}
            />
          ) : proyecto.idEtapaActual == 4 ? (
            <div className="w-full p-7">
              <h1 className="text-center font-bold text-xl">
                En control de calidad...
              </h1>
            </div>
          ) : proyecto.idEtapaActual == 7 ? (
            <InterfazSeguimientoTareasPintado
              proyecto={proyecto}
              idEmpleado={idEmpleadoMock}
            />
          ) : null}
        </>
      ) : (
        <InterfazNoTareasAsignadas />
      )}
    </div>
  );
}