"use client";
import { EmpleadosList } from "@/components/EmpleadosList";
import { Modal } from "@/components/Modal";
import { Noice } from "@/components/Noice";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import MyBError from "@/lib/mybError";
import { Empleado } from "@/models/empleado";
import { NoiceType } from "@/models/noice";
import { Proyecto } from "@/models/proyecto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const empleadoSchema = z.object({
  idEmpleado: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  correo: z.string(),
  telefono: z.string(),
  direccion: z.string(),
  documentoIdentidad: z.string(),
  tipoDocumento: z.string(),
  rol: z.string(),
  linkImg: z.string(),
  checked: z.boolean(),
});

const empleadosSchema = z.object({
  empleados: z.array(empleadoSchema).superRefine((val, ctx) => {
    if (!val.some((empleado) => empleado.checked)) {
      ctx.addIssue({
        code: "custom",
        message: "Debe seleccionar al menos un técnico",
        path: ["root"],
      });

      return z.NEVER;
    }
  }),
});

export function InterfazAsignacionTareas({
  proyecto,
  etapaLabel,
}: {
  proyecto: Proyecto;
  etapaLabel: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof empleadosSchema>>({
    resolver: zodResolver(empleadosSchema),
    defaultValues: { empleados: [] },
  });
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando técnicos...",
  });

  useEffect(() => {
    const fetchTecnicosDisponibles = async () => {
      try {
        const res = await fetch("/api/empleado/disponibles/tecnico");
        const data = await res.json();

        const formatedData = data.map((empleado: Empleado) => ({
          ...empleado,
          checked: false,
        }));
  
        const parsedData = z.array(empleadoSchema).safeParse(formatedData);
  
        if (parsedData.success) {
          form.setValue("empleados", parsedData.data);
        } else {
          throw new MyBError("Error en la carga de datos de supervisores");
        }
  
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else setNoice({ type: "error", message: "Error al cargar los técnicos" });
      }
    };

    fetchTecnicosDisponibles();
  }, [form]);

  const asignarTareas = async () => {
    const data = {
      idProyecto: proyecto.idProyecto,
      idEmpleados: form.getValues("empleados")
        .filter((empleado) => empleado.checked)
        .map((empleado) => empleado.idEmpleado),
      fechaAsignacion: new Date(),
    };
    const res = await fetch("/api/proyecto/asignar-empleados", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new MyBError("Error al asignar las tareas");
    }

    return res.json();
  };

  const onSubmit = async (data: z.infer<typeof empleadosSchema>) => {
    setNoice({
      type: "loading",
      message: "Asignando tareas...",
      styleType: "modal",
    });

    try {
      const empleados = data.empleados
        .filter((empleado) => empleado.checked)
        .map((empleado) => empleado.idEmpleado);
      const { idProyecto, idEtapaActual } = proyecto;

      await asignarTareas();

      setOpen(false);
      setNoice({
        type: "success",
        message: "Tareas asignadas correctamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error", message: "Error al asignar las tareas" });
    }
  };
  return (
    <Form {...form}>
      {noice && <Noice noice={noice} />}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center gap-4 w-full">
          <Button
            onClick={() => setOpen(true)}
            className="w-2/3 mt-4 text-lg font-bold"
            variant="outline"
            type="button"
          >
            Asignar Tarea de {etapaLabel}
          </Button>

          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
            className="w-2/3"
          >
            <FormField
              control={form.control}
              name="empleados"
              render={({ field }) => (
                <div className="w-full flex flex-col items-center max-h-80vh">
                  <FormLabel className="text-lg font-bold mb-4">
                    Asignar Tarea de {etapaLabel}
                  </FormLabel>

                  <div className="overflow-y-auto w-full">
                    <EmpleadosList
                      messageNothingAdded="No hay empleados disponibles"
                      empleados={field.value}
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 "
                      selector={(index, item) => (
                        <FormField
                          control={form.control}
                          name={`empleados.${index}.checked`}
                          render={({ field }) => (
                            <Switch
                              id={item.idEmpleado!.toString()}
                              checked={field.value}
                              onClick={() => {
                                field.onChange(!field.value);
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  {form.formState.errors.empleados?.root && (
                    <span className="text-red-500 text-lg">
                      {form.formState.errors.empleados?.root.message}
                    </span>
                  )}
                  <Button className="w-2/3 mt-4 text-lg" type="submit">
                    Asignar Tarea
                  </Button>
                </div>
              )}
            />
          </Modal>
        </div>
      </form>
    </Form>
  );
}
