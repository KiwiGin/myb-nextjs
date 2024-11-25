import { ProyectoTecnico } from "@/models/proyecto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EspecificacionesList } from "@/components/EspecificacionesList";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Counter } from "@/components/Counter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { Modal } from "@/components/Modal";
import { FeedbackList } from "@/components/FeedbackList";
import MyBError from "@/lib/mybError";

const resultadosSchema = z.object({
  idParametro: z.number(),
  resultadoTecnico: z.number(),
  resultadoSupervisor: z.number(),
});

const feedbackResultadosSchema = z.object({
  idFeedback: z.number(),
  aprobado: z.boolean(),
  comentario: z.string(),
  resultados: z.array(resultadosSchema),
});

const especificacionSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidad: z.string(),
    valorMaximo: z.number().optional(),
    valorMinimo: z.number().optional(),
    resultado: z.union([z.number(), z.string()]),
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
  especificaciones: z.array(especificacionSchema).superRefine((val, ctx) => {
    if (val.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Debe existir al menos una especificacion",
        fatal: true,
      });

      return z.NEVER;
    }

    const minBiggerMax = val.filter(
      (espec) => Number(espec.valorMaximo) < Number(espec.valorMinimo)
    );
    if (minBiggerMax.length > 0) {
      minBiggerMax.forEach((espec) => {
        ctx.addIssue({
          code: "custom",
          message: `Valor maximo es mayor que el valor minimo en ${espec.nombre}`,
          path: ["root"],
        });
      });

      return z.NEVER;
    }

    const invalidResult = val.filter(
      (espec) =>
        Number(espec.resultado) < Number(espec.valorMinimo) ||
        Number(espec.resultado) > Number(espec.valorMaximo)
    );

    if (invalidResult.length > 0) {
      invalidResult.forEach((espec) => {
        ctx.addIssue({
          code: "custom",
          message: `El resultado de ${espec.nombre} no esta dentro de los limites`,
          path: [val.indexOf(espec), "resultado"],
        });

        ctx.addIssue({
          code: "custom",
          message: `El resultado de ${espec.nombre} no esta dentro de los limites`,
          path: ["root"],
        });

        ctx.addIssue({
          code: "custom",
          message: `Es mayor que el resultado`,
          path: [val.indexOf(espec), "valorMinimo"],
        });

        ctx.addIssue({
          code: "custom",
          message: `Es menor que el resultado`,
          path: [val.indexOf(espec), "valorMaximo"],
        });
      });

      return z.NEVER;
    }
  }),
});

const reparacionSchema = z.object({
  pruebas: z.array(pruebaSchema).min(1, "Debe existir al menos una prueba"),
  feedback: feedbackResultadosSchema.optional(),
});

export function InterfazSeguimientoTareasReparacion({
  proyecto,
  idEmpleado,
}: {
  proyecto: ProyectoTecnico;
  idEmpleado: string;
}) {
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando especificaciones...",
  });
  const [feedOpen, setFeedOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof reparacionSchema>>({
    resolver: zodResolver(reparacionSchema),
    defaultValues: { pruebas: [] },
  });

  const formatPruebas = () => {
    if (
      !proyecto.pruebas ||
      proyecto.pruebas === undefined ||
      proyecto.pruebas.length === 0
    )
      throw new MyBError(
        "Ha sido asignado a un proyecto, \n pero no se han podido cargar las pruebas"
      );

    const formattedPruebas = proyecto.pruebas.map((prueba) => ({
      idTipoPrueba: prueba.idTipoPrueba,
      nombre: prueba.nombre,
      especificaciones:
        prueba.especificaciones?.map((espec) => ({
          ...espec,
          resultado: Number(espec.valorMaximo) - Number(espec.valorMinimo),
        })) || [],
    }));

    const parsedData = z.array(pruebaSchema).safeParse(formattedPruebas);

    if (parsedData.success) {
      form.setValue("pruebas", formattedPruebas);
    } else {
      throw new MyBError(
        "Ha sido asignado a un proyecto, \n pero no se han podido cargar las especificaciones"
      );
    }
  };

  const formatFeedback = () => {
    if (!proyecto.feedback) return;

    const feedback = proyecto.feedback;
    const parsedData = feedbackResultadosSchema.safeParse(feedback);

    if (parsedData.success) {
      form.setValue("feedback", feedback);
    } else {
      throw new MyBError(
        "Su ultima reparación ha sido rechazada, pero hubo un error al cargar el feedback"
      );
    }
  };

  useEffect(() => {
    try {
      formatPruebas();
      formatFeedback();
      setNoice(null);
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error" });
      console.error(error);
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof reparacionSchema>) => {
    setNoice({
      type: "loading",
      message: "Registrando resultados...",
      styleType: "modal",
    });

    try {
      console.log("Empleado:");
      console.log(idEmpleado);
      console.log("Resultados");
      console.log(data.pruebas);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      setNoice({
        type: "success",
        message: "Resultados registrados con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          // window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({
          type: "error",
          message: "Hubo un error al registrar sus resultados",
        });
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      {noice && <Noice noice={noice} />}

      {form.watch("feedback") && (
        <div className="flex w-full justify-end my-2">
          <Button
            variant={"outline"}
            onClick={() => setFeedOpen(true)}
            className="w-1/2 font-bold"
          >
            Ver Informe de Errores
          </Button>
          <Modal
            isOpen={feedOpen}
            onClose={() => setFeedOpen(false)}
            className="w-full md:mx-11 lg:mx-10 flex flex-col items-center gap-y-4"
          >
            <h1 className="text-2xl font-bold">Informe de Errores</h1>
            <FeedbackList
              feedback={form.watch("feedback")}
              pruebas={form.watch("pruebas")}
              messageNothingAdded="No hay feedback"
              className=" grid sm:grid-cols-1 lg:grid-cols-2 gap-4"
            />
            <div className="my-2 w-4/5">
              <h2 className="text-lg font-bold pl-4">Comentarios</h2>
              <p className="min-h-20 max-h-20 p-2 overflow-y-auto border-2 rounded-lg w-full shadow-md">
                {form.watch("feedback")?.comentario}
              </p>
            </div>
            <Button onClick={() => setFeedOpen(false)} className="w-1/4">
              Cerrar
            </Button>
          </Modal>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col items-center">
          <FormField
            control={form.control}
            name="pruebas"
            render={({ field }) => (
              <EspecificacionesList
                rol="tecnico"
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
                        form.formState.errors.pruebas[index]?.especificaciones
                          ?.root.message
                      }
                    </span>
                  )
                }
              />
            )}
          />
          <Button type="submit" className="w-1/2 mt-8">
            Registrar Valores
          </Button>
        </div>
      </form>
    </Form>
  );
}
