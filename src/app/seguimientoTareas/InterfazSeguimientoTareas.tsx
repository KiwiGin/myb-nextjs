"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { Proyecto } from "@/models/proyecto";
import { useEffect, useState } from "react";
import { z } from "zod";
import { InterfazSeguimientoTareasReparacion } from "./InterfazSeguimientoTareasReparacion";
import { Noice } from "@/components/Noice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    ruc: z.string(),
    direccion: z.string(),
    telefono: z.string(),
    correo: z.string(),
    documentoIdentidad: z.string(),
    tipoDocumento: z.string(),
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
      linkImg: z.string().optional().optional(),
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
          unidad: z.string(),
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
              unidad: z.string(),
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
    })
  ).nullable(),
})

export function InterfazSeguimientoTareas() {
  const [idEmpleadoMock, setIdEmpleadoMock] = useState<string>("5");
  const [idProyectoMock, setIdProyectoMock] = useState<string>("3");
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando tareas...",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIdProyecto, setNewIdProyecto] = useState<string>("");

  const fetchTareas = async () => {
    try {
      const res = await fetch(`/api/proyecto/por-id/${idProyectoMock}`);
      const data = await res.json();

      console.log("data", data);
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

  const handleIdProyectoChange = () => {
    setIdProyectoMock(newIdProyecto);
    setIsDialogOpen(false);
    fetchTareas();
  };

  useEffect(() => {
    fetchTareas();
  }, [idProyectoMock]);

  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <Button onClick={() => setIsDialogOpen(true)}   className="fixed top-5 right-5 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
        Cambiar Proyecto
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Abrir Modal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Proyecto</DialogTitle>
            <DialogDescription>
              Ingresa el nuevo ID del proyecto para actualizar los datos.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nuevo ID de Proyecto"
            value={newIdProyecto}
            onChange={(e) => setNewIdProyecto(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleIdProyectoChange}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {noice ? (
        <Noice noice={noice} />
      ) : proyecto ? (
        <>
          <ProyectoHeader proyecto={proyecto} />
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