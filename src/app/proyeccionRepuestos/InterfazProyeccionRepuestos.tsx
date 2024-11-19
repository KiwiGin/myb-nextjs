"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import RepuestosList from "@/components/RepuestosList";
import { Button } from "@/components/ui/button";
import { Repuesto } from "@/models/repuesto";

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
    quantity: z
      .union([z.number(), z.undefined(), z.string()])
      .optional(),
  })
  .refine(
    (val) =>
      !val.checked ||
      (val.quantity !== "" && val.quantity !== undefined),
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

  const idJefe = 1;

  useEffect(() => {
    async function fetchRepuestos() {
      try {
        const response = await fetch(`/api/repuesto/faltantes/por-jefe/${idJefe}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Error al obtener los repuestos requeridos');
        }

        const data: { repuesto: Repuesto; cantidadFaltante: number }[] = await response.json();
        const repuestosFaltantes = data.map((repuestoFaltante) => ({
          idRepuesto: repuestoFaltante.repuesto.idRepuesto!,
          nombre: repuestoFaltante.repuesto.nombre,
          precio: Number(repuestoFaltante.repuesto.precio),
          descripcion: repuestoFaltante.repuesto.descripcion,
          linkImg: repuestoFaltante.repuesto.linkImg || '',
          checked: false,
          stockRequerido: repuestoFaltante.cantidadFaltante,
          quantity: repuestoFaltante.cantidadFaltante,
        }));

        form.setValue('repuestos', repuestosFaltantes);

      } catch (error) {
        console.error('Error fetching repuestos:', error);
      }
    }
    fetchRepuestos();
  }, [form]);

  const onSubmit = (data: ProyeccionData) => {
    const selectedRepuestos = data.repuestos.filter(
      (repuesto) => repuesto.checked
    );

    const respuestosSolicitados = selectedRepuestos.map((repuesto) => ({
      idRepuesto: repuesto.idRepuesto,
      cantidadSolicitada: repuesto.quantity,
    }));

    fetch('/api/repuesto/solicitados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(respuestosSolicitados),
    });
    
    alert('Repuestos solicitados agregados exitosamente');
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
        Proyeccion de Repuestos
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
