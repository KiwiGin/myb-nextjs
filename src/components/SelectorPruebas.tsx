import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { TipoPruebaCard } from "@/components/TipoPruebaCard";
import { z } from "zod";

// Define la estructura de una prueba usando Zod
const tipoPruebaSchema = z.object({
  idTipoPrueba: z.number(),
  nombre: z.string(),
  parametros: z.array(
    z.object({
      idParametro: z.number(),
      nombre: z.string(),
      unidades: z.string(),
    })
  ),
});

type Prueba = z.infer<typeof tipoPruebaSchema>;

interface SelectorPruebasProps {
  proyecto: Proyecto;
  setProyecto: Dispatch<SetStateAction<Proyecto>>;
}

export function SelectorPruebas({
  proyecto,
  setProyecto,
}: SelectorPruebasProps) {
  const [pruebas, setPruebas] = useState<Prueba[]>([]);

  const fetchPruebas = async () => {
    const res = await fetch("/api/pruebaconparametro");
    const data = await res.json();
    const parsedData = z.array(tipoPruebaSchema).safeParse(data); 
    if (parsedData.success) {
      setPruebas(parsedData.data);
    } else {
      console.error("Error en la validación de los datos de pruebas");
    }
  };

  useEffect(() => {
    fetchPruebas();
  }, []);

  const togglePrueba = (pruebaId: number) => {
    setProyecto((prev) => {
      const prueba = pruebas.find((p) => p.idTipoPrueba === pruebaId);
      if (!prueba) return prev;

      const parametroIds = prueba.parametros.map((parametro) => parametro.idParametro);
      const isSelected = parametroIds.every((id) => prev.idParametros!.includes(id));

      const newIdParametros = isSelected
        ? prev.idParametros!.filter((id) => !parametroIds.includes(id))
        : [...prev.idParametros!, ...parametroIds];

      const newValoresMaximos = isSelected
        ? prev.valoresMaximos!.filter((_, index) => !parametroIds.includes(prev.idParametros![index]))
        : [...prev.valoresMaximos!, ...Array(parametroIds.length).fill(0)];

      const newValoresMinimos = isSelected
        ? prev.valoresMinimos!.filter((_, index) => !parametroIds.includes(prev.idParametros![index]))
        : [...prev.valoresMinimos!, ...Array(parametroIds.length).fill(0)];

      return {
        ...prev,
        idParametros: newIdParametros,
        valoresMaximos: newValoresMaximos,
        valoresMinimos: newValoresMinimos,
      };
    });
  };

  const handleValorChange = (
    parametroId: number,
    valor: number,
    tipo: "max" | "min"
  ) => {
    setProyecto((prev) => {
      const index = prev.idParametros!.indexOf(parametroId);
      if (index !== -1) {
        const newValores = tipo === "max" ? [...prev.valoresMaximos!] : [...prev.valoresMinimos!];
        newValores[index] = valor;
        return tipo === "max"
          ? { ...prev, valoresMaximos: newValores }
          : { ...prev, valoresMinimos: newValores };
      }
      return prev;
    });
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold">Seleccionar Pruebas</h3>
      <div className="flex flex-col space-y-2">
        {pruebas.map((prueba) => {
          const isSelected = prueba.parametros.every((parametro) =>
            proyecto.idParametros!.includes(parametro.idParametro)
          );
          return (
            <TipoPruebaCard
              key={prueba.idTipoPrueba}
              prueba={prueba}
              isSelected={isSelected}
              onToggle={() => togglePrueba(prueba.idTipoPrueba)}
              valoresMaximos={isSelected ? proyecto.valoresMaximos!.slice(proyecto.idParametros!.indexOf(prueba.parametros[0].idParametro), proyecto.idParametros!.indexOf(prueba.parametros[0].idParametro) + prueba.parametros.length) : []}
              valoresMinimos={isSelected ? proyecto.valoresMinimos!.slice(proyecto.idParametros!.indexOf(prueba.parametros[0].idParametro), proyecto.idParametros!.indexOf(prueba.parametros[0].idParametro) + prueba.parametros.length) : []}
              onValorChange={(parametroId, valor, tipo) =>
                handleValorChange(parametroId, valor, tipo)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
