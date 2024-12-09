"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, set, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { RepuestosList } from "@/components/RepuestosList";
import { Button } from "@/components/ui/button";
import { Repuesto } from "@/models/repuesto";
import { Switch } from "@/components/ui/switch";
import { Counter } from "@/components/Counter";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";

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
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando repuestos solicitados...",
  });

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
        setNoice(null);
      } catch (error) {
        console.error("Error fetching repuestos:", error);
        setNoice({
          type: "error",
          message: "Error al obtener los repuestos requeridos",
        });
      }
    }
    fetchRepuestos();
  }, [form]);

  const onSubmit = async (data: ProyeccionData) => {
    setNoice({
      type: "loading",
      message: "Actualizando repuestos...",
    });

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

      setNoice({
        type: "success",
        message: "Repuestos actualizados exitosamente",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      console.error("Error en el envío de datos:", error);
      setNoice({
        type: "error",
        message: "Error al actualizar los repuestos",
      });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-4 flex-1 justify-center"
    >
      {noice && <Noice noice={noice} />}
      <h1 className="mb-4 text-center text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Visualización de repuestos requeridos
      </h1>
      <RepuestosList
        repuestos={repuestoField.fields}
        className="grid lg:grid-cols-2 gap-4"
        messageNothingAdded="No hay repuestos solicitados"
        counter={(index) => (
          <Controller
            name={`repuestos.${index}.quantity`}
            control={form.control}
            render={({ field }) => (
              <Counter
                {...field}
                className={`w-full ${
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
      {repuestoField.fields.length > 0 && (
        <div className="w-full flex justify-center my-5">
          <Button type="submit">Marcar como obtenidos</Button>
        </div>
      )}
    </form>
  );
}
