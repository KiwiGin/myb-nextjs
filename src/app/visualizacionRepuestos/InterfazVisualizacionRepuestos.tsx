"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { REPUESTOS } from "../proyectos/[idProyecto]/InterfazAsignacionRepuestos";
import { useEffect } from "react";
import RepuestosList from "@/components/RepuestosList";
import { Button } from "@/components/ui/button";

// Define la estructura de un repuesto usando Zod
const repuestoSchema = z
  .object({
    idRepuesto: z.number(),
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    link_img: z.string().optional(),
    checked: z.boolean(),
    stock_solicitado: z.number().optional(),
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
        link_img: repuesto.link_img || "",
        checked: false,
        stock_solicitado: repuesto.stock_solicitado,
        quantity: repuesto.stock_solicitado,
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
        className="grid lg:grid-cols-2 gap-4"
        messageNothingAdded="No hay repuestos por asignados a sus proyectos"
        repuestos={repuestosField.fields}
        fr={form}
      />
      <div className="w-full flex justify-center">
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
