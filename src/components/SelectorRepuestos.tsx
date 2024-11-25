// SelectorRepuestos.tsx
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { RepuestoCard } from "@/components/RepuestoCard";
import { z } from "zod";

// Define la estructura de un repuesto usando Zod
const repuestoSchema = z.object({
  idRepuesto: z.number(),
  nombre: z.string(),
  precio: z.number(),
  descripcion: z.string(),
  linkImg: z.string().url().nullable().optional(),
  stockActual: z.number().min(0),
  stockRequerido: z.number().min(0),
});

type Repuesto = z.infer<typeof repuestoSchema>;

interface SelectorRepuestosProps {
  proyecto: Proyecto;
  setProyecto: Dispatch<SetStateAction<Proyecto>>;
}

export function SelectorRepuestos({
  proyecto,
  setProyecto,
}: SelectorRepuestosProps) {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);

  const fetchRepuestos = async () => {
    const res = await fetch("/api/repuesto");
    const data = await res.json();

    // Convertir el campo `precio` a número en cada repuesto antes de la validación
    const formattedData = data.map((repuesto: Repuesto) => ({
      ...repuesto,
      precio: Number(repuesto.precio),
    }));

    const parsedData = z.array(repuestoSchema).safeParse(formattedData); 
    if (parsedData.success) {
      setRepuestos(parsedData.data);
    } else {
      console.error("Error en la validación de los datos de repuestos");
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const toggleRepuesto = (repuestoId: number) => {
    setProyecto((prev) => {
      const isSelected = prev.idRepuestos!.includes(repuestoId);
      const newIdRepuestos = isSelected
        ? prev.idRepuestos!.filter((id) => id !== repuestoId)
        : [...prev.idRepuestos!, repuestoId];
      const newCantidadesRepuestos = isSelected
        ? prev.cantidadesRepuestos!.filter((_, index) => prev.idRepuestos![index] !== repuestoId)
        : [...prev.cantidadesRepuestos!, 1];
      return {
        ...prev,
        idRepuestos: newIdRepuestos,
        cantidadesRepuestos: newCantidadesRepuestos,
      };
    });
  };

  const handleCantidadChange = (repuestoId: number, cantidad: number) => {
    setProyecto((prev) => {
      const index = prev.idRepuestos!.indexOf(repuestoId);
      if (index !== -1) {
        const nuevasCantidades = [...prev.cantidadesRepuestos!];
        nuevasCantidades[index] = cantidad;
        return { ...prev, cantidadesRepuestos: nuevasCantidades };
      }
      return prev;
    });
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold">Seleccionar Repuestos</h3>
      <div className="flex flex-col space-y-2">
        {repuestos.map((repuesto) => {
          const isSelected = proyecto.idRepuestos!.includes(repuesto.idRepuesto);
          return (
            <RepuestoCard
              key={repuesto.idRepuesto}
              repuesto={repuesto}
              isSelected={isSelected}
              onToggle={() => toggleRepuesto(repuesto.idRepuesto)}
              cantidad={
                isSelected
                  ? proyecto.cantidadesRepuestos![
                      proyecto.idRepuestos!.indexOf(repuesto.idRepuesto)
                    ]
                  : 1
              }
              onCantidadChange={(cantidad: number) =>
                handleCantidadChange(repuesto.idRepuesto, cantidad)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
