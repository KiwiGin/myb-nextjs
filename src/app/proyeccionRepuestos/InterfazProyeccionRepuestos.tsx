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
    cantidadProyectada: z.union([z.number(), z.undefined(), z.string()]).optional(),
  })
  .refine(
    (val) =>
      !val.checked ||
      (val.cantidadProyectada !== "" && val.cantidadProyectada !== undefined),
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
        link_img: repuesto.link_img || "",
        checked: false,
        stock_solicitado: repuesto.stock_solicitado,
        cantidadProyectada: repuesto.stock_solicitado,
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RepuestosList
        className="grid grid-cols-2 gap-4"
        messageNothingAdded="No hay repuestos por solicitar"
        repuestos={repuestosField.fields}
        fr={form}
      />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
