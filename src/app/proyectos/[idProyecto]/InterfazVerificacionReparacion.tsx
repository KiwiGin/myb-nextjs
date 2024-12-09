import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Proyecto } from "@/models/proyecto";
import { Noice } from "@/components/Noice";
import { ResultadosModal } from "@/components/ResultadosModal";
import { EspecificacionesList } from "@/components/EspecificacionesList";
import { Counter } from "@/components/Counter";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/Combobox";

const especificacionSchema = z.object({
  idParametro: z.number(),
  resultado: z
    .preprocess((value) => {
      if (value === "") {
        return undefined;
      }
      return Number(value);
    }, z.union([z.number(), z.undefined()]))
    .refine((value) => typeof value !== "undefined", {
      message: "No se puede dejar un resultado vacío",
    }),
});

const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  especificaciones: z.array(especificacionSchema).superRefine((value, ctx) => {
    const noResult = value.some(
      (especificacion) => typeof especificacion.resultado === "undefined"
    );
    if (noResult) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se puede dejar un resultado vacío",
        path: ["root"],
      });
      return z.NEVER;
    }
  }),
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
      idResultadoPruebaTecnico: Math.max(
        ...proyecto!.resultados!.map((r) => r.idResultadoPrueba)
      ),
      fecha: new Date(),
      aprobado: true,
      comentario: "",
      resultados:
        proyecto.especificaciones?.map((prueba) => ({
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
          ?.parametros.find(
            (p) => p.idParametro === especificacion.idParametro
          );

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
      setNoice({
        type: "error",
        message: "Hubo un error al enviar el feedback.",
      });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      {noice && <Noice noice={noice} />}

      <Button onClick={() => setDialogOpen(true)} className="mb-4">
        Ver Resultados Anteriores
      </Button>

      <ResultadosModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        proyecto={proyecto}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit)(event);
        }}
        className="w-full mb-6"
      >
        <FormField
          control={form.control}
          name="resultados"
          render={({ field }) => (
            <EspecificacionesList
              especificaciones={field.value}
              especificacionesOriginales={proyecto.especificaciones || []}
              className="grid grid-cols-1 lg:grid-cols-2 gap-2"
              messageNothingAdded="No hay pruebas"
              counterResult={(prueba_index, espec_index) => (
                <FormField
                  name={`resultados.${prueba_index}.especificaciones.${espec_index}.resultado`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Counter
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          if (e.target.value !== "") generateFeedback();
                        }}
                        className={`w-20 ${
                          form.formState.errors.resultados?.[prueba_index]
                            ?.especificaciones?.[espec_index]
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </FormItem>
                  )}
                />
              )}
              error={(index) =>
                form.formState.errors.resultados?.[index]?.especificaciones
                  ?.root && (
                  <span className="text-red-500 text-lg">
                    {
                      form.formState.errors.resultados[index]?.especificaciones
                        ?.root.message
                    }
                  </span>
                )
              }
            />
          )}
        />

        <div className="mb-4">
          <FormField
            name="comentario"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentario</FormLabel>
                <Textarea
                  {...field}
                  placeholder="Ingresa un comentario..."
                  className="min-h-20 max-h-32 overflow-y-auto border-2 rounded-lg w-full shadow-md"
                />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="aprobado"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel htmlFor="idSupervisor">Aprobado</FormLabel>
              <Combobox<string>
                items={["Si", "No"]}
                initialValue={"Si"}
                getValue={(r) => r}
                getLabel={(r) => r}
                getRealValue={(r) => r}
                originalValue={field.value ? "Si" : "No"}
                onSelection={(r) => {
                  field.onChange(r === "Si");
                }}
                itemName={"Supervisor"}
              />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4 w-full">
          Enviar Feedback
        </Button>
      </form>
    </Form>
  );
}
