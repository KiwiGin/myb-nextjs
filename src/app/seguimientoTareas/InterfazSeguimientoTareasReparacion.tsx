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
      // Aquí puedes realizar la petición a la API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular espera

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
        {form.watch("resultados").map((prueba, pruebaIndex) => (
          <div key={prueba.idTipoPrueba} className="mb-6">
            <h3 className="text-lg font-bold">{`Prueba: ${prueba.idTipoPrueba}`}</h3>

            {prueba.especificaciones.map((especificacion, especIndex) => (
              <div key={especificacion.idParametro} className="flex items-center gap-4">
                <span>{`Parámetro ${especificacion.idParametro}:`}</span>
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
            ))}
          </div>
        ))}

        <Button type="submit" className="mt-4 w-full">
          Registrar Resultados
        </Button>
      </form>
    </Form>
  );
}