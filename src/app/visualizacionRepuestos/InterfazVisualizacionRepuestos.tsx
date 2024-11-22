"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { RepuestosList } from "@/components/RepuestosList";
import { Button } from "@/components/ui/button";
import { Repuesto } from "@/models/repuesto";
import { Switch } from "@/components/ui/switch";
import { Counter } from "@/components/Counter";

// Define la estructura de un repuesto usando Zod
const repuestoSchema = z
  .object({
    idRepuesto: z.number(),
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    linkImg: z.string().optional(),
    checked: z.boolean(),
    stockRequerido: z.number().optional(),
    quantity: z.union([z.number(), z.undefined(), z.string()]).optional(),
  })
  .refine(
    (val) =>
      !val.checked || (val.quantity !== "" && val.quantity !== undefined),
    {
      message: "Debe ingresar un valor si está marcado.",
      path: ["cantidadProyectada"],
    }
  );

const proyeccionSchema = z.object({
  repuestos: z.array(repuestoSchema),
});

export type ProyeccionData = z.infer<typeof proyeccionSchema>;

export function InterfazVisualizacionRepuestos() {
  const form = useForm<z.infer<typeof proyeccionSchema>>({
    resolver: zodResolver(proyeccionSchema),
    defaultValues: {
      repuestos: [],
    },
  });

  const repuestoField = useFieldArray({
    control: form.control,
    name: "repuestos",
  });

  useEffect(() => {
    async function fetchRepuestos() {
      try {
        const response = await fetch("/api/repuesto/requeridos", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error al obtener los repuestos requeridos");
        }
        const data: Repuesto[] = await response.json();
        form.setValue(
          "repuestos",
          data.map((repuesto) => ({
            idRepuesto: repuesto.idRepuesto || 0,
            nombre: repuesto.nombre,
            precio: Number(repuesto.precio),
            descripcion: repuesto.descripcion,
            linkImg: repuesto.linkImg || "",
            checked: false,
            stockRequerido: repuesto.stockRequerido,
            quantity: repuesto.stockRequerido,
          }))
        );
      } catch (error) {
        console.error("Error fetching repuestos:", error);
      }
    }
    fetchRepuestos();
  }, [form]);

  const onSubmit = async (data: ProyeccionData) => {
    const selectedRepuestos = data.repuestos
      .filter((repuesto) => repuesto.checked)
      .map((repuesto) => ({
        idRepuesto: repuesto.idRepuesto,
        cantidadObtenida: Number(repuesto.quantity),
      }));

    try {
      const response = await fetch("/api/repuesto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRepuestos),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar los repuestos");
      }
      console.log("Repuestos actualizados correctamente");
    } catch (error) {
      console.error("Error en el envío de datos:", error);
    }
  };

  useEffect(() => {
    console.log("Errors");
    console.log(form.formState.errors.repuestos);
  }, [form.formState.errors]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-4 flex-1 justify-center"
    >
      <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Visualización de repuestos requeridos
      </h1>
      <RepuestosList
        repuestos={repuestoField.fields}
        className="grid lg:grid-cols-2 gap-4"
        messageNothingAdded="No hay repuestos seleccionados"
        counter={(index, item) => (
          <Controller
            name={`repuestos.${index}.quantity`}
            control={form.control}
            render={({ field }) => (
              <Counter
                {...field}
                className={`w-1/2 ${
                  form.formState.errors.repuestos?.[index]?.quantity
                    ? "border-red-500"
                    : ""
                }`}
                min={1}
                disabled={!form.watch(`repuestos.${index}.checked`)}
              />
            )}
          />
        )}
        selector={(index, item) => (
          <Controller
            name={`repuestos.${index}.checked`}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={item.idRepuesto?.toString()}
                checked={field.value}
                onClick={() => {
                  field.onChange(!field.value);
                }}
              />
            )}
          />
        )}
      />
      <div className="w-full flex justify-center">
        <Button type="submit">Marcar como obtenidos</Button>
      </div>
    </form>
  );
}
