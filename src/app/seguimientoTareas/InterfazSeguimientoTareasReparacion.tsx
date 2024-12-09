import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Noice } from "@/components/Noice";
import { Proyecto } from "@/models/proyecto";
import { ResultadosModal } from "@/components/ResultadosModal";
import { EspecificacionesList } from "@/components/EspecificacionesList";
import { Counter } from "@/components/Counter";

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

const resultadosSchema = z.object({
  idProyecto: z.number(),
  idEmpleado: z.number(),
  fecha: z.date(),
  resultados: z.array(pruebaSchema),
});

type ResultadosPruebaForm = {
  idTipoPrueba: number;
  especificaciones: {
    idParametro: number;
    resultado: number;
  }[];
};

type FormValues = {
  idProyecto: number;
  idEmpleado: number;
  fecha: Date;
  resultados: ResultadosPruebaForm[];
};

interface SeguimientoTareasProps {
  proyecto: Proyecto;
  idEmpleado: number;
}

export function InterfazSeguimientoTareasReparacion({
  proyecto,
  idEmpleado,
}: SeguimientoTareasProps) {
  const [noice, setNoice] = useState<{
    type: "loading" | "success" | "error";
    message: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(resultadosSchema),
    defaultValues: {
      idProyecto: proyecto?.idProyecto,
      idEmpleado,
      fecha: new Date(),
      resultados: [],
    },
  });

  useEffect(() => {
    if (proyecto?.especificaciones) {
      const formattedPruebas: ResultadosPruebaForm[] =
        proyecto.especificaciones.map((prueba) => ({
          idTipoPrueba: prueba.idTipoPrueba,
          especificaciones: prueba.parametros.map((parametro) => ({
            idParametro: parametro.idParametro,
            resultado: 0,
          })),
        }));

      form.setValue("resultados", formattedPruebas);
    }
  }, [proyecto, form]);

  const onSubmit = async (data: FormValues) => {
    setNoice({ type: "loading", message: "Registrando resultados..." });

    try {
      const res = await fetch("/api/proyecto/reparando", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await res.json();

      setNoice({
        type: "success",
        message: "Resultados registrados con éxito",
      });

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
        message: "Hubo un error al registrar los resultados.",
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
        className="w-full"
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

        <Button type="submit" className="mt-4 w-full">
          Registrar Resultados
        </Button>
      </form>
    </Form>
  );
}
