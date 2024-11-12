import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TipoPrueba } from "@/types";
import { z } from "zod";

const parametrosSchema = z.array(z.number());

export function SelectorPruebas({ setProyecto, proyecto }) {
  const [pruebas, setPruebas] = useState<TipoPrueba[]>([]);

  const fetchPruebas = async () => {
    const res = await fetch("/api/pruebaconparametro");
    const data = await res.json();
    setPruebas(data);
  };

  useEffect(() => {
    fetchPruebas();
  }, []);

  const handleParametroChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      const values = parametrosSchema.parse(e.target.value.split(",").map((val) => parseFloat(val.trim())));
      setProyecto((prev) => ({ ...prev, [field]: values }));
    } catch (error) {
      console.error("Error en la validación de parámetros:", error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Label htmlFor="idParametros">ID Parámetros (separados por comas)</Label>
        <Input id="idParametros" name="idParametros" type="text" onChange={(e) => handleParametroChange(e, "idParametros")} placeholder="Ejemplo: 4, 5, 6" />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="valoresMaximos">Valores Máximos (separados por comas)</Label>
        <Input id="valoresMaximos" name="valoresMaximos" type="text" onChange={(e) => handleParametroChange(e, "valoresMaximos")} placeholder="Ejemplo: 100.5, 200.3, 150.0" />
      </div>

      <div className="mb-4">
        <Label htmlFor="valoresMinimos">Valores Mínimos (separados por comas)</Label>
        <Input id="valoresMinimos" name="valoresMinimos" type="text" onChange={(e) => handleParametroChange(e, "valoresMinimos")} placeholder="Ejemplo: 50.0, 100.0, 75.0" />
      </div>
    </>
  );
}
