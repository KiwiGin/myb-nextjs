"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SelectorRepuestos } from "@/components/SelectorRepuestos";
import { Cliente } from "@/models/cliente";
import { Empleado } from "@/models/empleado";
import { Proyecto } from "@/models/proyecto";
import { SelectorPruebas } from "@/components/SelectorPruebas";
import { z } from "zod";
import { Repuesto, RepuestoForm } from "@/models/repuesto";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/Combobox";
import { Input } from "@/components/ui/input";
import RepuestosList from "@/components/RepuestosList";
import { Modal } from "@/components/Modal";
import { Counter } from "@/components/Counter";
import { Switch } from "@/components/ui/switch";
import { TipoPrueba, TipoPruebaForms } from "@/models/tipoprueba";
import { PruebasList } from "@/components/PruebasList";
import path from "path";

const repuestoSchema = z.object({
  idRepuesto: z.number(),
  nombre: z.string(),
  precio: z.number(),
  descripcion: z.string(),
  linkImg: z.string().nullable().optional(),
  stockActual: z.number().min(0).optional(),
  stockSolicitado: z.number().optional(),
  checked: z.boolean(),
  quantity: z.union([z.number(), z.undefined(), z.string()]).optional(),
});

const parametroSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidades: z.string(),
    valorMaximo: z.union([z.number(), z.string(), z.undefined()]).optional(),
    valorMinimo: z.union([z.number(), z.string(), z.undefined()]).optional(),
  })
  .refine(
    (val) =>
      (val.valorMaximo !== undefined && val.valorMaximo !== "") ||
      (val.valorMinimo !== undefined && val.valorMinimo !== ""),
    {
      message: "Debe ingresar un valor máximo y mínimo.",
      path: ["valorMaximo"],
    }
  )
  .refine(
    (val) =>
      (val.valorMaximo !== undefined && val.valorMaximo !== "") ||
      (val.valorMinimo !== undefined && val.valorMinimo !== ""),
    {
      message: "Debe ingresar un valor máximo y mínimo.",
      path: ["valorMinimo"], // Otra validación personalizada.
    }
  );

const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  nombre: z.string(),
  checked: z.boolean(),
  parametros: z.array(parametroSchema),
});

const proyectoSchema = z.object({
  titulo: z.string().min(1, { message: "Debe ingresar un título." }),
  descripcion: z.string().min(1, { message: "Debe ingresar una descripción." }),
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
  idCliente: z.number({ message: "Debe seleccionar un cliente." }),
  idSupervisor: z.number({ message: "Debe seleccionar un supervisor." }),
  idJefe: z.number({ message: "Debe seleccionar un jefe." }),
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
});

export type RegistroProyecto = z.infer<typeof proyectoSchema>;

export function InterfazRegistroProyecto() {
  const form = useForm<RegistroProyecto>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fechaInicio: new Date(),
      fechaFin: new Date(),
      idCliente: 0,
      idSupervisor: 0,
      idJefe: 0,
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

  const [proyecto, setProyecto] = useState<Proyecto>({
    titulo: "",
    descripcion: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    idCliente: 0,
    idSupervisor: 0,
    idJefe: 0,
    idEtapaActual: 1,
    costoManoObra: 0,
    idRepuestos: [],
    cantidadesRepuestos: [],
    idParametros: [],
    valoresMaximos: [],
    valoresMinimos: [],
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [supervisores, setSupervisores] = useState<Empleado[]>([]);
  const [jefes, setJefes] = useState<Empleado[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoForm[]>([]);
  const [pruebas, setPruebas] = useState<TipoPruebaForms[]>([]);
  const [openRepuestos, setOpenRepuestos] = useState(false);
  const [openPruebas, setOpenPruebas] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchClientes = async () => {
    const res = await fetch("/api/cliente");
    const data = await res.json();
    setClientes(data);
  };

  const fetchSupervisores = async () => {
    const res = await fetch("/api/empleado/por-rol/supervisor");
    const data = await res.json();
    setSupervisores(data);
  };

  const fetchJefes = async () => {
    const res = await fetch("/api/empleado/por-rol/jefe");
    const data = await res.json();
    setJefes(data);
  };

  const fetchRepuestos = async () => {
    const res = await fetch("/api/repuesto");
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
      console.log(parsedData.error);
      setError("Error en la validación de los datos de repuestos");
    }
  };

  const fetchPruebas = async () => {
    const res = await fetch("/api/pruebaconparametro");
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

    console.log(formatedData);

    const parsedData = z.array(pruebaSchema).safeParse(formatedData);

    if (parsedData.success) {
      setPruebas(parsedData.data);
    } else {
      setError("Error en la validación de los datos de pruebas");
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchSupervisores();
    fetchJefes();
    fetchRepuestos();
    fetchPruebas();
  }, []);

  const handleSelectRepuesto = (repuesto: RepuestoForm) => {
    setRepuestos((prev) =>
      prev.map((r) =>
        r.idRepuesto === repuesto.idRepuesto ? { ...r, checked: true } : r
      )
    );
    repuestoField.append({ ...repuesto, checked: true, quantity: 1 });
  };

  const handleUnselectRepuesto = (repuesto: RepuestoForm, index: number) => {
    setRepuestos((prev) =>
      prev.map((r) =>
        r.idRepuesto === repuesto.idRepuesto ? { ...r, checked: false } : r
      )
    );
    repuestoField.remove(index);
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

  const onSubmit = async (proy: RegistroProyecto) => {
    try {
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
        idJefe: proy.idJefe,
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

      const data = await res.json();
      console.log("Proyecto registrado:", data);

      // Limpiar el formulario o realizar alguna acción adicional si es necesario
      setProyecto({
        titulo: "",
        descripcion: "",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        idCliente: 0,
        idSupervisor: 0,
        idJefe: 0,
        idEtapaActual: 1,
        costoManoObra: 0,
        idRepuestos: [],
        cantidadesRepuestos: [],
        idParametros: [],
        valoresMaximos: [],
        valoresMinimos: [],
      });

      alert("Proyecto registrado con éxito");
    } catch (error) {
      console.error("Error en el registro del proyecto:", error);
      alert("Hubo un error al registrar el proyecto. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    console.log("repuestos");
    console.log(form.watch("repuestos"));
  }, [form.watch("repuestos")]);

  if (error) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <Label>Error: {error}</Label>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
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
            <div className="mb-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fechaInicio">Fecha de Inicio</FormLabel>
                    <Input
                      type="date"
                      id="fechaInicio"
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
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fechaFin">Fecha de Fin</FormLabel>
                    <Input
                      type="date"
                      id="fechaFin"
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
                      className="border rounded p-1 w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Select para Cliente */}
          <FormField
            control={form.control}
            name="idCliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="idCliente">Clientes</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select para Supervisor */}
          <FormField
            control={form.control}
            name="idSupervisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="idSupervisor">Supervisores</FormLabel>
                <Combobox<Empleado>
                  items={supervisores}
                  getValue={(r) => {
                    if (r && typeof r !== "string" && "idEmpleado" in r) {
                      return r.idEmpleado.toString();
                    }
                  }}
                  getLabel={(r) => r.nombre}
                  getRealValue={(r) => r}
                  onSelection={(r) => {
                    field.onChange(r.idEmpleado);
                  }}
                  itemName={"Supervisor"}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select para Jefe */}
          <FormField
            control={form.control}
            name="idJefe"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="idJefe">Jefes</FormLabel>
                <Combobox<Empleado>
                  items={jefes}
                  getValue={(r) => {
                    if (r && typeof r !== "string" && "idEmpleado" in r) {
                      return r.idEmpleado.toString();
                    }
                  }}
                  getLabel={(r) => r.nombre}
                  getRealValue={(r) => r}
                  onSelection={(r) => {
                    field.onChange(r.idEmpleado);
                  }}
                  itemName={"Jefe"}
                />
                <FormMessage />
              </FormItem>
            )}
          />

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

          <h1>REPUESTOS SELECCIONADOS</h1>
          <RepuestosList
            repuestos={repuestoField.fields}
            className="w-full"
            messageNothingAdded="No hay repuestos seleccionados"
            counter={(index, item) => (
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
                  handleUnselectRepuesto(item, index);
                }}
                type="button"
              >
                &times;
              </Button>
            )}
          />
          <Button type="button" onClick={() => setOpenRepuestos(true)}>
            Añadir repuestos
          </Button>

          <Modal
            isOpen={openRepuestos}
            onClose={() => setOpenRepuestos(false)}
            className=""
          >
            <div className="w-full flex items-center">
              <h2 className="text-3xl font-extrabold my-2 dark:text-white">
                Selecciona los repuestos
              </h2>
            </div>

            <div
              className="overflow-y-scroll flex-col items-center"
              style={{ maxHeight: "80vh", maxWidth: "75vw" }}
            >
              <RepuestosList
                repuestos={repuestos}
                messageNothingAdded="No hay repuestos seleccionados"
                selector={(index, item) => (
                  <div className="flex h-full items-center gap-2">
                    <Switch
                      id={item.idRepuesto?.toString()}
                      checked={item.checked}
                      onClick={() => {
                        if (!item.checked) {
                          handleSelectRepuesto(item);
                        } else {
                          handleUnselectRepuesto(item, index);
                        }
                      }}
                    />
                  </div>
                )}
              />
            </div>
            <div className="w-full flex items-center justify-center py-4">
              <Button className="w-1/2" onClick={() => setOpenRepuestos(false)}>
                Cerrar
              </Button>
            </div>
          </Modal>

          <h1>PRUEBAS SELECCIONADAS</h1>
          <PruebasList
            className="w-full"
            pruebas={pruebaField.fields}
            messageNothingAdded="No hay pruebas seleccionadas"
            counterMin={(prueba_index, param_index, item) => (
              <Controller
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
                    disabled={!form.watch(`pruebas.${prueba_index}.checked`)}
                  />
                )}
              />
            )}
            counterMax={(prueba_index, param_index, item) => (
              <Controller
                name={`pruebas.${prueba_index}.parametros.${param_index}.valorMaximo`}
                control={form.control}
                render={({ field }) => (
                  <Counter
                    {...field}
                    className={`w-20 ${
                      form.formState.errors.pruebas?.[prueba_index]
                        ?.parametros?.[param_index]?.valorMaximo
                        ? "border-red-500"
                        : ""
                    }`}
                    disabled={!form.watch(`pruebas.${prueba_index}.checked`)}
                  />
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
          />
          <Button type="button" onClick={() => setOpenPruebas(true)}>
            Añadir pruebas
          </Button>

          <Modal
            isOpen={openPruebas}
            onClose={() => setOpenPruebas(false)}
            className=""
          >
            <div className="w-full flex items-center">
              <h2 className="text-3xl font-extrabold my-2 dark:text-white">
                Selecciona las pruebas
              </h2>
            </div>

            <div
              className="overflow-y-scroll flex-col items-center"
              style={{ maxHeight: "80vh", maxWidth: "75vw" }}
            >
              <PruebasList
                className="grid grid-cols-1 gap-10"
                pruebas={pruebas}
                messageNothingAdded="No hay pruebas seleccionadas"
                selector={(index, item) => (
                  <div className="flex h-full items-center gap-2">
                    <Switch
                      id={item.idTipoPrueba?.toString()}
                      checked={item.checked}
                      onClick={() => {
                        if (!item.checked) {
                          handleSelectPrueba(item);
                        } else {
                          handleUnselectPrueba(item, index);
                        }
                      }}
                    />
                  </div>
                )}
              />
            </div>
            <div className="w-full flex items-center justify-center py-4">
              <Button className="w-1/2" onClick={() => setOpenPruebas(false)}>
                Cerrar
              </Button>
            </div>
          </Modal>

          <Button type="submit" className="w-full mt-4">
            Registrar Proyecto
          </Button>
        </form>
      </Form>
    </div>
  );
}
