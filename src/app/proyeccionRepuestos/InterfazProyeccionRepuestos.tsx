"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { REPUESTOS } from "@/models/MOCKUPS";
import { useEffect } from "react";
import RepuestosList from "@/components/RepuestosList";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/Counter";
import { Switch } from "@/components/ui/switch";

// Define la estructura de un repuesto usando Zod
const repuestoSchema = z
  .object({
    idRepuesto: z.number(),
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    linkImg: z.string().optional(),
    checked: z.boolean(),
    stockActual: z.number(),
    stocKSolicitado: z.number().nullable().optional(),
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

export function InterfazProyeccionRepuestos() {
  const form = useForm<z.infer<typeof proyeccionSchema>>({
    resolver: zodResolver(proyeccionSchema),
    defaultValues: {
      repuestos: [],
    },
  });

  const repuestosField = useFieldArray({
    control: form.control,
    name: "repuestos",
  });

  useEffect(() => {
    /*
    fetch a la api
    */
    form.setValue(
      "repuestos",
      REPUESTOS.map((repuesto) => ({
        idRepuesto: repuesto.idRepuesto || 0,
        nombre: repuesto.nombre,
        precio: repuesto.precio,
        descripcion: repuesto.descripcion,
        linkImg: repuesto.linkImg || "",
        checked: false,
        stockActual: repuesto.stockActual || 0,
        stocKSolicitado: repuesto.stockSolicitado,
        quantity: repuesto.stockSolicitado,
      }))
    );
  }, []);

  const onSubmit = (data: ProyeccionData) => {
    const selectedRepuestos = data.repuestos.filter(
      (repuesto) => repuesto.checked
    );
    console.log("ON SUBMIT");
    console.log(selectedRepuestos);
  };

  useEffect(() => {
    console.log("Errors");
    console.log(form.formState.errors.repuestos?.[0]?.quantity);
  }, [form.formState.errors]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-4 flex-1 justify-center"
    >
      <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Proyeccion de Repuestos
      </h1>
      <RepuestosList
        className="grid lg:grid-cols-2 gap-4"
        messageNothingAdded="No hay repuestos por asignados a sus proyectos"
        repuestos={repuestosField.fields}
        counter={(index, item) => (
          <Controller
            name={`repuestos.${index}.quantity`}
            control={form.control}
            render={({ field }) => (
              <Counter
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                }}
                className={`w-1/2 ${
                  form.formState.errors.repuestos?.[index]?.quantity
                    ? "border-red-500"
                    : ""
                }`}
                max={item.quantity}
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
                id={item.idRepuesto.toString()}
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
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
