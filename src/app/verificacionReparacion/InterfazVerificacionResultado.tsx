"use client";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { ProyectoSupervisor } from "@/models/proyecto";
import { use, useEffect, useState } from "react";
import { z } from "zod";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/Counter";
import { EspecificacionesList } from "@/components/EspecificacionesList";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeedbackList } from "@/components/FeedbackList";
import { Modal } from "@/components/Modal";
import { FeedbackResultados } from "@/models/feedback";
import { Textarea } from "@/components/ui/textarea";

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

const proyectoSchema = z.object({
  idProyecto: z.number(),
  titulo: z.string(),
  cliente: z.object({
    idCliente: z.number(),
    nombre: z.string(),
  }),
  descripcion: z.string(),
  idEtapaActual: z.number(),
  etapaActual: z.string(),
  pruebas: z.array(pruebaSchema),
});

type FeedbackSupervisor = Pick<FeedbackResultados, "resultados" | "aprobado">;

export function InterfazVerificacionResultado() {
  const [idEmpleado, setIdEmpleado] = useState<string>("1");
  const [proyecto, setProyecto] = useState<ProyectoSupervisor | null>(null);
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
    /* Obtener el proyecto al que esta asigando el empleado
    const res = await fetch(`/api/proyecto/por-id/${idEmpleado}`);
    const data = await res.json();
     */

    //obtenido por el fetch
    const data = {
      idProyecto: 1,
      titulo: "Proyecto de prueba",
      cliente: {
        idCliente: 1,
        nombre: "Cliente de prueba",
      },
      descripcion: "Descripcion de prueba",
      idEtapaActual: 4,
      etapaActual: "Etapa 1",
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

    /* const data = { message: "no_proyecto" }; */

    if (data.message && data.message === "no_proyecto") {
      return;
    }

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

    const formattedProyecto = {
      ...data,
      pruebas: formattedPruebas,
    };

    const parsedData = proyectoSchema.safeParse(formattedProyecto);

    if (parsedData.success) {
      console.log(parsedData.data);
      setProyecto(parsedData.data);
      form.setValue("pruebas", formattedPruebas);
    } else {
      console.error(parsedData.error);
      throw new Error("Error al cargar la reparación a revisar");
    }
  };

  const onSubmit = async (data: z.infer<typeof verificacionSchema>) => {
    console.log("Empleado:");
    console.log(idEmpleado);
    console.log("Resultados");
    console.log(data);

    setOpen(false);
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
    fetchReparacion()
      .catch((error) => {
        if (error instanceof Error)
          setNoice({ type: "error", message: error.message });
        else setNoice({ type: "error" });
        console.error(error);
      })
      .finally(() => {
        setNoice(null);
      });
  }, []);

  useEffect(() => {
    if (open) {
      const feedback = formattedFeedback();
      setFeedback(feedback);
    }
  }, [open]);

  if (noice) return <Noice noice={noice} />;

  return proyecto ? (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <ProyectoHeader proyecto={proyecto} />
      <ProjectFlow etapa={Number(proyecto.idEtapaActual) - 1} />
      {proyecto.idEtapaActual == 4 && (
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  className="w-1/2 mt-8"
                >
                  Verficar Resultados
                </Button>
              </div>

              <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                className="w-full md:mx-11 lg:mx-10 flex flex-col items-center gap-y-4"
              >
                <h1 className="text-2xl font-bold">
                  Verificación de Reparación
                </h1>
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
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <h1 className="text-2xl font-bold">No hay reparaciones por revisar</h1>
    </div>
  );
}
