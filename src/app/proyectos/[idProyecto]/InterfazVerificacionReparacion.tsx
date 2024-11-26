import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Proyecto } from "@/models/proyecto";
import { Noice } from "@/components/Noice";
import { ResultadosModal } from "@/components/ResultadosModal";

const especificacionSchema = z.object({
  idParametro: z.number(),
  resultado: z.number(), // El jefe ingresa el valor numérico
});

const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  especificaciones: z.array(especificacionSchema),
});

const feedbackSchema = z.object({
  idProyecto: z.number(),
  idEmpleado: z.number(),
  idResultadoPruebaTecnico: z.number(),
  aprobado: z.boolean(),
  comentario: z.string(),
  fecha: z.date(),
  resultados: z.array(pruebaSchema),
});

interface FormValues {
  idProyecto: number;
  idEmpleado: number;
  idResultadoPruebaTecnico: number;
  fecha: Date;
  aprobado: boolean;
  comentario: string;
  resultados: {
    idTipoPrueba: number;
    especificaciones: {
      idParametro: number;
      resultado: number;
    }[];
  }[];
}

interface InterfazVerificacionReparacionProps {
  proyecto: Proyecto;
  idEmpleado: number;
}

export function InterfazVerificacionReparacion({
  proyecto,
  idEmpleado,
}: InterfazVerificacionReparacionProps) {
  const [noice, setNoice] = useState<{
    type: "loading" | "success" | "error";
    message: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      idProyecto: proyecto.idProyecto,
      idEmpleado,
      idResultadoPruebaTecnico: Math.max(...proyecto!.resultados!.map(r => r.idResultadoPrueba)),
      fecha: new Date(),
      aprobado: true,
      comentario: "",
      resultados: proyecto.especificaciones?.map((prueba) => ({
        idTipoPrueba: prueba.idTipoPrueba,
        especificaciones: prueba.parametros.map((parametro) => ({
          idParametro: parametro.idParametro,
          resultado: 0,
        })),
      })) || [],
    },
  });

  const generateFeedback = () => {
    const comentarios: string[] = [];
    let aprobado = true;

    form.watch("resultados").forEach((prueba) => {
      prueba.especificaciones.forEach((especificacion) => {
        const parametroOriginal = proyecto.especificaciones
          ?.find((p) => p.idTipoPrueba === prueba.idTipoPrueba)
          ?.parametros.find((p) => p.idParametro === especificacion.idParametro);

        if (parametroOriginal) {
          const { valorMinimo, valorMaximo, nombre } = parametroOriginal;
          if (
            especificacion.resultado < valorMinimo ||
            especificacion.resultado > valorMaximo
          ) {
            aprobado = false;
            comentarios.push(
              `El parámetro ${nombre} está fuera del rango (${valorMinimo}-${valorMaximo}).`
            );
          }
        }
      });
    });

    const comentario = comentarios.length
      ? comentarios.join("\n")
      : "Todos los parámetros están dentro del rango.";

    form.setValue("comentario", comentario);
    form.setValue("aprobado", aprobado);
  };

  const onSubmit = async (data: FormValues) => {
    setNoice({ type: "loading", message: "Enviando feedback..." });
    try {
      const res = await fetch("/api/proyecto/feedback", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al enviar feedback");

      setNoice({ type: "success", message: "Feedback enviado con éxito" });
      form.reset();

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });

    } catch (error) {
      setNoice({ type: "error", message: "Hubo un error al enviar el feedback." });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      {noice && <Noice noice={noice} />}

      <Button onClick={() => setDialogOpen(true)} className="mb-4">
        Ver Resultados Anteriores
      </Button>

      <ResultadosModal open={dialogOpen} onClose={() => setDialogOpen(false)} proyecto={proyecto} />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log("Formulario antes del envío:", form.getValues());
          form.handleSubmit(onSubmit)(event);
        }}
        className="w-full"
      >
        <h3 className="text-lg font-bold mb-4">Registrar Feedback</h3>

        {form.watch("resultados").map((prueba, pruebaIndex) => {
          const especificacionOriginal = proyecto.especificaciones?.find(
            (spec) => spec.idTipoPrueba === prueba.idTipoPrueba
          );

          return (
            <div key={prueba.idTipoPrueba} className="mb-6">
              <h3 className="text-lg font-bold">{`Prueba: ${especificacionOriginal?.nombre}`}</h3>
              {prueba.especificaciones.map((especificacion, especIndex) => {
                const parametroOriginal = especificacionOriginal?.parametros.find(
                  (param) => param.idParametro === especificacion.idParametro
                );

                return (
                  <div key={especificacion.idParametro} className="mb-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{`Parámetro: ${parametroOriginal?.nombre}`}</span>
                      <span>{`Unidad: ${parametroOriginal?.unidad}`}</span>
                      <span>{`Valores: ${parametroOriginal?.valorMinimo} - ${parametroOriginal?.valorMaximo}`}</span>
                    </div>
                    <FormField
                      control={form.control}
                      name={`resultados.${pruebaIndex}.especificaciones.${especIndex}.resultado`}
                      render={({ field }) => (
                        <FormItem>
                          <input
                            {...field}
                            type="number"
                            className="w-16 text-center border border-gray-300 rounded"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              generateFeedback();
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="mb-4">
          <label className="block font-medium">Comentario generado</label>
          <textarea
            {...form.register("comentario")}
            className="w-full border border-gray-300 rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Aprobado</label>
          <select
            {...form.register("aprobado")}
            className="w-full border border-gray-300 rounded"
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>

        <Button type="submit" className="mt-4 w-full">
          Enviar Feedback
        </Button>
      </form>
    </Form>
  );
}
