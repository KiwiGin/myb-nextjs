"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/Counter";
import { EspecificacionesList } from "@/components/EspecificacionesList";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeedbackList } from "@/components/FeedbackList";
import { Modal } from "@/components/Modal";
import { FeedbackResultados } from "@/models/feedback";
import { Textarea } from "@/components/ui/textarea";
import MyBError from "@/lib/mybError";

const especificacionSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidad: z.string(),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional(),
    resultado: z.union([z.number(), z.string()]),
    resultadoTecnico: z.union([z.number(), z.string()]),
  })
  .superRefine((val, ctx) => {
    if (val.valorMaximo === undefined && val.valorMinimo === undefined) {
      ["valorMaximo", "valorMinimo"].forEach((key) => {
        ctx.addIssue({
          code: "custom",
          message: "Debe existir un valor maximo o minimo.",
          path: [key],
        });
      });

      return z.NEVER;
    }
  });

const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  nombre: z.string(),
  especificaciones: z.array(especificacionSchema),
});

const verificacionSchema = z.object({
  aprobado: z.boolean(),
  comentario: z.string().optional(),
  pruebas: z.array(pruebaSchema),
});

type FeedbackSupervisor = Pick<FeedbackResultados, "resultados" | "aprobado">;

export function InterfazVerificacionReparacion({
  idProyecto,
}: {
  idProyecto: number;
}) {
  const [idEmpleado, setIdEmpleado] = useState<string>("1");
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackSupervisor | undefined>(
    undefined
  );
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando reparación a revisar...",
  });

  const form = useForm<z.infer<typeof verificacionSchema>>({
    resolver: zodResolver(verificacionSchema),
    defaultValues: {
      aprobado: false,
      pruebas: [],
    },
  });

  const fetchReparacion = async () => {
    try {
      /* Obtener el proyecto al que esta asigando el empleado y proyecto 
    - idProyecto
    - idEmpleado
    const res = await fetch(`/api/proyecto/por-id/${idEmpleado}`);
    const data = await res.json();
     */

      //obtenido por el fetch
      const data = {
        pruebas: [
          {
            idTipoPrueba: 1,
            nombre: "Prueba de prueba",
            especificaciones: [
              {
                idParametro: 1,
                nombre: "Parametro de prueba",
                unidad: "Unidad de prueba",
                valorMaximo: 10,
                valorMinimo: 1,
                resultadoTecnico: 5,
              },
            ],
          },
        ],
      };

      const formattedPruebas = data.pruebas.map((prueba) => {
        const especificaciones = prueba.especificaciones?.map((espec) => {
          return {
            ...espec,
            resultado: Number(espec.valorMaximo) - Number(espec.valorMinimo),
          };
        });

        return {
          ...prueba,
          especificaciones,
        };
      });

      const parsedData = z.array(pruebaSchema).safeParse(formattedPruebas);

      if (parsedData.success) {
        form.setValue("pruebas", parsedData.data);
      } else {
        console.error(parsedData.error);
        throw new MyBError("Error al cargar la reparación a revisar");
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error" });
      console.error(error);
    }
  };

  const formattedFeedback = () => {
    let aprobado = true;

    const resultados = form.watch("pruebas").flatMap((prueba) =>
      prueba.especificaciones.map((espec) => {
        if (
          Number(espec.valorMaximo) < Number(espec.resultado) ||
          Number(espec.valorMinimo) > Number(espec.resultado)
        ) {
          aprobado = false;
        }

        return {
          idParametro: espec.idParametro,
          resultadoTecnico: Number(espec.resultadoTecnico),
          resultadoSupervisor: Number(espec.resultado),
        };
      })
    );

    return { resultados, aprobado };
  };

  useEffect(() => {
    fetchReparacion();
  }, []);

  useEffect(() => {
    if (open) {
      const feedback = formattedFeedback();
      setFeedback(feedback);
    }
  }, [open]);

  const registrarResultados = async () => {
    // Simulación de llamada al backend
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  };

  const onSubmit = async (data: z.infer<typeof verificacionSchema>) => {
    setNoice({
      type: "loading",
      message: "Enviando verificación de reparación",
      styleType: "modal",
    });

    try {
      console.log("Empleado:");
      console.log(idEmpleado);
      console.log("Resultados");
      console.log(data);

      await registrarResultados();

      setNoice({
        type: "success",
        message: "Verificación enviada exitosamente",
        styleType: "modal",
      });
      setOpen(false);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
        }, 3000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({ type: "error", message: "Error al enviar la verificación" });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 gap-3">
      {noice && <Noice noice={noice} />}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="w-full flex flex-col items-center">
              <FormField
                control={form.control}
                name="pruebas"
                render={({ field }) => (
                  <EspecificacionesList
                    rol="supervisor"
                    pruebas={field.value}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-2"
                    messageNothingAdded="No hay pruebas"
                    counterResult={(prueba_index, espec_index) => (
                      <FormField
                        name={`pruebas.${prueba_index}.especificaciones.${espec_index}.resultado`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <Counter
                              {...field}
                              className={`w-20 ${
                                form.formState.errors.pruebas?.[prueba_index]
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
                      form.formState.errors.pruebas?.[index]?.especificaciones
                        ?.root && (
                        <span className="text-red-500 text-lg">
                          {
                            form.formState.errors.pruebas[index]
                              ?.especificaciones?.root.message
                          }
                        </span>
                      )
                    }
                  />
                )}
              />

              <Button
                type="button"
                onClick={() => {
                  setOpen(true);
                }}
                className="w-1/2 my-8"
              >
                Verficar Resultados
              </Button>
            </div>

            <Modal
              isOpen={open}
              onClose={() => setOpen(false)}
              className="w-full md:mx-11 lg:mx-10 flex flex-col items-center gap-y-4"
            >
              <h1 className="text-2xl font-bold">Verificación de Reparación</h1>
              <FeedbackList
                feedback={feedback}
                pruebas={form.watch("pruebas")}
                messageNothingAdded="No hay feedback"
                className=" grid sm:grid-cols-1 lg:grid-cols-2 gap-4"
              />
              {feedback?.aprobado === false && (
                <div className="my-2 w-4/5">
                  <h2 className="text-lg font-bold pl-4 mb-2">Comentarios</h2>
                  <FormField
                    name="comentario"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Ingresa un comentario..."
                        className="min-h-20 max-h-32 overflow-y-auto border-2 rounded-lg w-full shadow-md"
                      />
                    )}
                  />
                </div>
              )}
              <div className="w-full flex flex-row justify-center space-x-4">
                <Button
                  type="submit"
                  className={`w-1/4 text-white ${
                    feedback?.aprobado ? "bg-emerald-800" : "bg-red-800"
                  }`}
                >
                  {feedback?.aprobado === true
                    ? "Enviar aprobación"
                    : "Enviar Rechazo"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-1/4"
                >
                  Cerrar
                </Button>
              </div>
            </Modal>
          </form>
        </Form>
      </div>
    </div>
  );
}
