"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cliente } from "@/models/cliente";
import { Empleado } from "@/models/empleado";
import { z } from "zod";
import { Repuesto, RepuestoForm } from "@/models/repuesto";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/Combobox";
import { Input } from "@/components/ui/input";
import { RepuestosList } from "@components/RepuestosList";
import { Counter } from "@/components/Counter";
import { TipoPrueba, TipoPruebaForms } from "@/models/tipoprueba";
import { PruebasList } from "@/components/PruebasList";
import PruebasStock from "@/components/PruebasStock";
import { RepuestosStock } from "@/components/RepuestosStock";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import MyBError from "@/lib/mybError";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const repuestoSchema = z
  .object({
    idRepuesto: z.number(),
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    linkImg: z.string().nullable().optional(),
    stockActual: z.number().min(0).optional(),
    stockSolicitado: z.number().optional(),
    checked: z.boolean(),
    quantity: z.union([z.number(), z.undefined(), z.string()]).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.checked && (val.quantity === undefined || val.quantity === "")) {
      ctx.addIssue({
        code: "custom",
        message: `Debe ingresar una cantidad para ${val.nombre}  si está marcado.`,
      });

      ctx.addIssue({
        code: "custom",
        message: `Debe ingresar un valor.`,
        path: ["quantity"],
      });
    }
  });

const parametroSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidades: z.string(),
    valorMaximo: z.union([z.number(), z.string(), z.undefined()]).optional(),
    valorMinimo: z.union([z.number(), z.string(), z.undefined()]).optional(),
  })
  .superRefine((val, ctx) => {
    if (
      (val.valorMaximo === undefined || val.valorMaximo === "") &&
      (val.valorMinimo === undefined || val.valorMinimo === "")
    ) {
      ["valorMaximo", "valorMinimo"].forEach((key) => {
        ctx.addIssue({
          code: "custom",
          message: "Debe ingresar un valor máximo o mínimo.",
          path: [key],
        });
      });

      return z.NEVER;
    }
  });
const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  nombre: z.string(),
  checked: z.boolean(),
  parametros: z.array(parametroSchema).superRefine((val, ctx) => {
    const minBiggerMax = val.filter(
      (param) => Number(param.valorMaximo) < Number(param.valorMinimo)
    );
    if (minBiggerMax.length > 0) {
      minBiggerMax.forEach((param) => {
        ctx.addIssue({
          code: "custom",
          message: `El valor máximo de ${param.nombre} debe ser mayor o igual al valor mínimo.`,
          path: ["root"],
        });

        ctx.addIssue({
          code: "custom",
          message: "El valor máximo debe ser mayor o igual al valor mínimo.",
          path: [val.indexOf(param), "valorMaximo"],
        });

        ctx.addIssue({
          code: "custom",
          message: "El valor minimo debe ser menor o igual al valor maximo.",
          path: [val.indexOf(param), "valorMinimo"],
        });
      });

      return z.NEVER;
    }
  }),
});

const proyectoSchema = z
  .object({
    titulo: z.string().min(1, { message: "Debe ingresar un título." }),
    descripcion: z
      .string()
      .min(1, { message: "Debe ingresar una descripción." }),
    fechaInicio: z.date().refine(
      (val) => val instanceof Date && !isNaN(val.getTime()), // Validación adicional si es necesario
      {
        message: "La fecha es inválida o no está en el formato esperado.",
      }
    ),
    fechaFin: z.date().refine(
      (val) => val instanceof Date && !isNaN(val.getTime()), // Validación adicional si es necesario
      {
        message: "La fecha es inválida o no está en el formato esperado.",
      }
    ),
    idCliente: z.number({ message: "Debe seleccionar un cliente." }).min(1, {
      message: "Debe seleccionar un cliente valido.",
    }),
    idSupervisor: z
      .number({ message: "Debe seleccionar un supervisor." })
      .min(1, {
        message: "Debe seleccionar un supervisor valido.",
      }),
    idEtapaActual: z.number({ message: "Debe seleccionar una etapa." }),
    costoManoObra: z
      .union([z.string(), z.number()])
      .refine((val) => val !== "" && val !== undefined, {
        message: "Debe ingresar un costo de mano de obra.",
      }),
    repuestos: z.array(repuestoSchema).optional(),
    pruebas: z
      .array(pruebaSchema)
      .min(1, { message: "Debe seleccionar al menos una prueba." }),
  })
  .superRefine((val, ctx) => {
    if (val.fechaFin < val.fechaInicio) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de fin debe ser mayor a la fecha de inicio.",
        path: ["fechaFin"],
      });

      return z.NEVER;
    }
  });

export type RegistroProyecto = z.infer<typeof proyectoSchema>;

export function InterfazRegistroProyecto() {
  const router = useRouter();

  const form = useForm<RegistroProyecto>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fechaInicio: new Date(),
      fechaFin: new Date(),
      idCliente: -1,
      idSupervisor: -1,
      idEtapaActual: 1,
      costoManoObra: 0,
      repuestos: [],
      pruebas: [],
    },
  });

  const repuestoField = useFieldArray({
    control: form.control,
    name: "repuestos",
  });

  const pruebaField = useFieldArray({
    control: form.control,
    name: "pruebas",
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [supervisores, setSupervisores] = useState<Empleado[]>([]);
  //const [jefes, setJefes] = useState<Empleado[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoForm[]>([]);
  const [pruebas, setPruebas] = useState<TipoPruebaForms[]>([]);
  const [openRepuestos, setOpenRepuestos] = useState(false);
  const [openPruebas, setOpenPruebas] = useState(false);

  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando datos del proyecto...",
  });

  const { data: session, status } = useSession();

  const fetchClientes = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de clientes...",
    });
    const res = await fetch("/api/cliente");

    if (!res.ok) throw new MyBError("Error en la carga de datos de clientes");

    const data = await res.json();
    setClientes(data);
  };

  const fetchSupervisores = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de supervisores...",
    });

    const res = await fetch("/api/empleado/por-rol/supervisor");

    if (!res.ok)
      throw new MyBError("Error en la carga de datos de supervisores");

    const data = await res.json();
    setSupervisores(data);
  };

  const fetchRepuestos = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de repuestos...",
    });

    const res = await fetch("/api/repuesto");

    if (!res.ok) throw new MyBError("Error en la carga de datos de repuestos");

    const data = await res.json();

    const formattedData = data.map((repuesto: Repuesto) => ({
      ...repuesto,
      precio: Number(repuesto.precio),
      checked: false,
      quantity: 0,
    }));

    const parsedData = z.array(repuestoSchema).safeParse(formattedData);
    if (parsedData.success) {
      setRepuestos(parsedData.data);
    } else {
      throw new MyBError("Error en la validación de los datos de repuestos");
    }
  };

  const fetchPruebas = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de pruebas...",
    });

    const res = await fetch("/api/pruebaconparametro");

    if (!res.ok) throw new MyBError("Error en la carga de datos de pruebas");

    const data = (await res.json()) as TipoPrueba[];

    const formatedData = data.map((prueba) => ({
      ...prueba,
      checked: false,
      parametros: prueba.parametros?.map((parametro) => ({
        ...parametro,
        valorMaximo: 0,
        valorMinimo: 0,
      })),
    }));

    const parsedData = z.array(pruebaSchema).safeParse(formatedData);

    if (parsedData.success) {
      setPruebas(parsedData.data);
    } else {
      throw new Error("Error en la validación de los datos de pruebas");
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchClientes(),
          fetchSupervisores(),
          fetchRepuestos(),
          fetchPruebas(),
        ]);
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else setNoice({ type: "error", message: "Error en la carga de datos" });
        console.error("Error en la carga de datos:", error);
      }
    };
    fetchData();
  }, [status]);

  const handleSelectRepuesto = (repuesto: RepuestoForm) => {
    setRepuestos((prev) =>
      prev.map((r) =>
        r.idRepuesto === repuesto.idRepuesto ? { ...r, checked: true } : r
      )
    );
    repuestoField.append({ ...repuesto, checked: true, quantity: 1 });
  };

  const handleUnselectRepuesto = (repuesto: RepuestoForm) => {
    setRepuestos((prev) =>
      prev.map((r) =>
        r.idRepuesto === repuesto.idRepuesto ? { ...r, checked: false } : r
      )
    );

    const repuesto_to_remove = repuestoField.fields.findIndex(
      (r) => r.idRepuesto === repuesto.idRepuesto
    );

    repuestoField.remove(repuesto_to_remove);
  };

  const handleSelectPrueba = (prueba: TipoPruebaForms) => {
    setPruebas((prev) =>
      prev.map((p) =>
        p.idTipoPrueba === prueba.idTipoPrueba ? { ...p, checked: true } : p
      )
    );

    pruebaField.append({
      ...prueba,
      checked: true,
      parametros: prueba.parametros.map((p) => ({
        ...p,
        valorMaximo: 0,
        valorMinimo: 0,
      })),
    });
  };

  const handleUnselectPrueba = (prueba: TipoPruebaForms, index: number) => {
    setPruebas((prev) =>
      prev.map((p) =>
        p.idTipoPrueba === prueba.idTipoPrueba ? { ...p, checked: false } : p
      )
    );

    pruebaField.remove(index);
  };

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (proy: RegistroProyecto) => {
    setNoice({
      type: "loading",
      message: "Registrando proyecto...",
      styleType: "modal",
    });

    try {
      if (status === "loading") throw new MyBError("No se ha iniciado sesión");

      const parametros = proy.pruebas.flatMap((prueba) => {
        if (prueba.checked) {
          return prueba.parametros.map((parametro) => parametro);
        }
        return [];
      });

      const formatedData = {
        titulo: proy.titulo,
        descripcion: proy.descripcion,
        fechaInicio: proy.fechaInicio,
        fechaFin: proy.fechaFin,
        idCliente: proy.idCliente,
        idSupervisor: proy.idSupervisor,
        idJefe: session?.user.id,
        idEtapaActual: proy.idEtapaActual,
        costoManoObra: Number(proy.costoManoObra),
        idRepuestos: proy.repuestos
          ? proy.repuestos?.map((repuesto) => repuesto.idRepuesto)
          : [],
        cantidadesRepuestos: proy.repuestos?.map(
          (repuesto) => repuesto.quantity
        ),
        idParametros: parametros.map((parametro) => parametro.idParametro),
        valoresMaximos: parametros.map((parametro) =>
          parametro.valorMaximo ? Number(parametro.valorMaximo) : 0
        ),
        valoresMinimos: parametros.map((parametro) =>
          parametro.valorMinimo ? Number(parametro.valorMinimo) : 0
        ),
      };

      const res = await fetch("/api/proyecto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatedData),
      });

      if (!res.ok) {
        throw new Error("Error al registrar el proyecto");
      }

      form.reset();

      setNoice({
        type: "success",
        message: "Proyecto registrado con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          router.replace("/");
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({ type: "error", message: "Error al registrar el proyecto" });
      console.error("Error al registrar el proyecto:", error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {noice && <Noice noice={noice} />}
      <h2 className="text-lg font-semibold mb-4">Registro de Proyecto</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Campos de entrada */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="titulo">Titulo</FormLabel>
                  <Input
                    type="text"
                    id="titulo"
                    {...field}
                    className="border rounded p-1 w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-4">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="descripcion">Descripción</FormLabel>
                  <Input
                    type="text"
                    id="descripcion"
                    {...field}
                    className="border rounded p-1 w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row justify-between">
            <div className="mb-4 w-1/2">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="fechaInicio">Fecha de Inicio</FormLabel>
                    <Input
                      type="date"
                      id="fechaInicio"
                      min={new Date().toISOString().split("T")[0]}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : new Date();
                        field.onChange(e.target.value ? date : new Date());
                        if (form.watch("fechaFin") < date) {
                          form.setValue("fechaFin", date);
                        }
                      }}
                      className="border rounded w-10/12"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-4 w-1/2">
              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fechaFin">Fecha de Fin</FormLabel>
                    <Input
                      type="date"
                      id="fechaFin"
                      min={
                        form.watch("fechaInicio").toISOString().split("T")[0]
                      }
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : new Date()
                        );
                      }}
                      className="border rounded w-10/12"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 mb-2">
            {/* Select para Cliente */}
            <FormField
              control={form.control}
              name="idCliente"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel htmlFor="idCliente">Cliente</FormLabel>
                  <div className="px-2">
                    <Combobox<Cliente>
                      items={clientes}
                      getValue={(r) => {
                        if (r && typeof r !== "string" && "idCliente" in r) {
                          return r.idCliente.toString();
                        }
                      }}
                      getLabel={(r) => r.nombre}
                      getRealValue={(r) => r}
                      onSelection={(r) => {
                        field.onChange(r.idCliente);
                      }}
                      itemName={"Cliente"}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select para Supervisor */}
            <FormField
              control={form.control}
              name="idSupervisor"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel htmlFor="idSupervisor">Supervisor</FormLabel>
                  <div className="px-2">
                    <Combobox<Empleado>
                      items={supervisores}
                      getValue={(r) => {
                        if (r && typeof r !== "string" && "idEmpleado" in r) {
                          return r.idEmpleado!.toString();
                        }
                      }}
                      getLabel={(r) => r.nombre + " " + r.apellido}
                      getRealValue={(r) => r}
                      onSelection={(r) => {
                        field.onChange(r.idEmpleado);
                      }}
                      itemName={"Supervisor"}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Costo de Mano de Obra */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="costoManoObra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="costoManoObra">
                    Costo de Mano de Obra (S/.)
                  </FormLabel>
                  <div className="flex items-center mt-2">
                    <span className="px-3 py-2 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      S/.
                    </span>
                    <Input
                      type="number"
                      id="costoManoObra"
                      {...field}
                      className="border rounded p-1 w-full"
                      min={1}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Repuestos */}
          <FormField
            control={form.control}
            name="repuestos"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center my-4">
                <FormLabel htmlFor="repuestos">
                  Repuestos seleccionados
                </FormLabel>
                <RepuestosList
                  repuestos={field.value || []}
                  className="w-full"
                  messageNothingAdded="No hay repuestos seleccionados"
                  counter={(index) => (
                    <Controller
                      name={`repuestos.${index}.quantity`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex h-full items-center gap-2">
                          <Counter
                            {...field}
                            className={`w-16 ${
                              form.formState.errors.repuestos?.[index]?.quantity
                                ? "border-red-500"
                                : ""
                            }`}
                            min={1}
                            disabled={!form.watch(`repuestos.${index}.checked`)}
                          />
                        </div>
                      )}
                    />
                  )}
                  remover={(index, item) => (
                    <Button
                      className="absolute right-0 top-0 z-50"
                      onClick={() => {
                        handleUnselectRepuesto(item);
                      }}
                      type="button"
                    >
                      &times;
                    </Button>
                  )}
                  error={(index) =>
                    form.formState.errors.repuestos?.[index]?.root && (
                      <span className="text-red-500 font-sans text-sm">
                        {
                          form.formState.errors.repuestos?.[index]?.root
                            ?.message
                        }
                      </span>
                    )
                  }
                />
                <Button type="button" onClick={() => setOpenRepuestos(true)}>
                  Añadir repuestos
                </Button>
                {form.formState.errors.repuestos?.root && (
                  <span className="text-red-500 font-sans text-sm">
                    {form.formState.errors.repuestos?.root?.message}
                  </span>
                )}
              </FormItem>
            )}
          />

          <RepuestosStock
            open={openRepuestos}
            setOpen={setOpenRepuestos}
            repuestos={repuestos}
            handleSelectRepuesto={handleSelectRepuesto}
            handleUnselectRepuesto={handleUnselectRepuesto}
          />

          {/* Pruebas */}
          <FormField
            control={form.control}
            name="pruebas"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center my-2">
                <FormLabel htmlFor="pruebas">Pruebas seleccionadas</FormLabel>
                <PruebasList
                  className="w-full"
                  pruebas={field.value}
                  messageNothingAdded="No hay pruebas seleccionadas"
                  counterMin={(prueba_index, param_index) => (
                    <FormField
                      name={`pruebas.${prueba_index}.parametros.${param_index}.valorMinimo`}
                      control={form.control}
                      render={({ field }) => (
                        <Counter
                          {...field}
                          className={`w-20 ${
                            form.formState.errors.pruebas?.[prueba_index]
                              ?.parametros?.[param_index]?.valorMinimo
                              ? "border-red-500"
                              : ""
                          }`}
                          disabled={
                            !form.watch(`pruebas.${prueba_index}.checked`)
                          }
                        />
                      )}
                    />
                  )}
                  counterMax={(prueba_index, param_index) => (
                    <FormField
                      name={`pruebas.${prueba_index}.parametros.${param_index}.valorMaximo`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Counter
                            {...field}
                            className={`w-20 ${
                              form.formState.errors.pruebas?.[prueba_index]
                                ?.parametros?.[param_index]?.valorMaximo
                                ? "border-red-500"
                                : ""
                            }`}
                            disabled={
                              !form.watch(`pruebas.${prueba_index}.checked`)
                            }
                          />
                        </FormItem>
                      )}
                    />
                  )}
                  remover={(index, item) => (
                    <Button
                      className="absolute right-0 top-0 z-10"
                      onClick={() => {
                        handleUnselectPrueba(item, index);
                      }}
                      type="button"
                    >
                      &times;
                    </Button>
                  )}
                  error={(index) =>
                    form.formState.errors.pruebas?.[index]?.parametros
                      ?.root && (
                      <span className="text-red-500 font-sans text-sm">
                        {
                          form.formState.errors.pruebas?.[index]?.parametros
                            ?.root?.message
                        }
                      </span>
                    )
                  }
                />
                <Button type="button" onClick={() => setOpenPruebas(true)}>
                  Añadir pruebas
                </Button>
                {form.formState.errors.pruebas && (
                  <span className="text-red-500 font-sans text-sm">
                    {form.formState.errors.pruebas?.message}
                  </span>
                )}
              </FormItem>
            )}
          />

          <PruebasStock
            open={openPruebas}
            setOpen={setOpenPruebas}
            pruebas={pruebas}
            handleSelectPrueba={handleSelectPrueba}
            handleUnselectPrueba={handleUnselectPrueba}
          />

          <Button type="submit" className="w-full mt-4">
            Registrar Proyecto
          </Button>
        </form>
      </Form>
    </div>
  );
}
