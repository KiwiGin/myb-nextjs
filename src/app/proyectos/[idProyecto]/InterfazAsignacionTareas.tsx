"use client";
import { EmpleadosList } from "@/components/EmpleadosList";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Empleado } from "@/models/empleado";
import { Proyecto } from "@/models/proyecto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const empleadoSchema = z.object({
  idEmpleado: z.number(),
  usuario: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  correo: z.string(),
  telefono: z.string(),
  direccion: z.string(),
  documentoIdentidad: z.string(),
  tipoDocumento: z.string(),
  rol: z.string(),
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
export function InterfazAsignacionTareas({ proyecto }: { proyecto: Proyecto }) {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof empleadosSchema>>({
    resolver: zodResolver(empleadosSchema),
    defaultValues: { empleados: [] },
  });

  const fetchTecnicos = async () => {
    const res = await fetch("/api/empleado/por-rol/tecnico");
    const data = await res.json();

    const formatedData = data.map((empleado: Empleado) => ({
      ...empleado,
      checked: false,
    }));

    const parsedData = z.array(empleadoSchema).safeParse(formatedData);

    if (parsedData.success) {
      form.setValue("empleados", parsedData.data);
    } else {
      console.log(parsedData.error);
      throw new Error("Error en la carga de datos de supervisores");
    }
  };

  const onSubmit = async (data: z.infer<typeof empleadosSchema>) => {
    const empleados = data.empleados
      .filter((empleado) => empleado.checked)
      .map((empleado) => empleado.idEmpleado);
    const idProyecto = proyecto.idProyecto;

    console.log({
      idProyecto,
      empleados,
    });
    
    setOpen(false);
    /* if (empleados.length === 0) {
      alert("Debe seleccionar al menos un técnico");
      return;
    }

    const body = {
      idProyecto: proyecto.idProyecto,
      empleados: empleados.map((empleado) => empleado.idEmpleado),
    };

    const res = await fetch("/api/proyecto/asignar-tarea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Tarea asignada correctamente");
    } else {
      alert("Error al asignar tarea");
    } */
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  useEffect(() => {
    console.log(form.formState.errors.empleados);
  }, [form.formState.errors.empleados]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center gap-4 w-full">
          <Button
            onClick={() => setOpen(true)}
            className="w-2/3 mt-4 text-lg font-bold"
            variant="outline"
            type="button"
          >
            Asignar Tarea de Reparación
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
                    Asignar Tarea de Reparación
                  </FormLabel>

                  <div className="overflow-y-auto w-full">
                    <EmpleadosList
                      messageNothingAdded="No hay repuestos"
                      empleados={field.value}
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 "
                      selector={(index, item) => (
                        <FormField
                          control={form.control}
                          name={`empleados.${index}.checked`}
                          render={({ field }) => (
                            <Switch
                              id={item.idEmpleado.toString()}
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
