  import React, { useEffect, useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { Button } from "@/components/ui/button";
  import { Form, FormField, FormItem } from "@/components/ui/form";
  import { Counter } from "@/components/Counter";
  import { EspecificacionesList } from "@/components/EspecificacionesList";
  import { Noice } from "@/components/Noice";
  import { Modal } from "@/components/Modal";
  import MyBError from "@/lib/mybError";
  import { Proyecto } from "@/models/proyecto";

  const especificacionSchema = z.object({
    idParametro: z.number(),
    resultado: z.string().nonempty("El resultado es obligatorio."),
  });

  const pruebaSchema = z.object({
    idTipoPrueba: z.number(),
    especificaciones: z.array(especificacionSchema),
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
      resultado: string;
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

  export function InterfazSeguimientoTareasReparacion({ proyecto, idEmpleado }: SeguimientoTareasProps) {
    const [noice, setNoice] = useState<{ type: "loading" | "success" | "error"; message: string } | null>(null);

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
        const formattedPruebas: ResultadosPruebaForm[] = proyecto.especificaciones.map((prueba) => ({
          idTipoPrueba: prueba.idTipoPrueba,
          especificaciones: prueba.parametros.map((parametro) => ({
            idParametro: parametro.idParametro,
            resultado: "",
          })),
        }));

        form.setValue("resultados", formattedPruebas);
      }
    }, [proyecto, form]);

    const onSubmit = async (data: FormValues) => {
      setNoice({ type: "loading", message: "Registrando resultados..." });

      try {
        console.log("Datos enviados a la API:", data);

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {form.watch("resultados").map((prueba, pruebaIndex) => {
          const especificacionOriginal = proyecto.especificaciones?.find(
            (spec) => spec.idTipoPrueba === prueba.idTipoPrueba
          );

          return (
            <div key={prueba.idTipoPrueba} className="mb-6">
              <h3 className="text-lg font-bold">{`Prueba: ${especificacionOriginal?.nombre || prueba.idTipoPrueba}`}</h3>

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
                          <Counter {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}


          <Button type="submit" className="mt-4 w-full">
            Registrar Resultados
          </Button>
        </form>
      </Form>
    );
  }