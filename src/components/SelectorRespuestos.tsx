import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Repuesto } from "@/models/repuesto";
import { Proyecto } from "@/models/proyecto";
import { z } from "zod";

const repuestosSchema = z.array(z.number());

export function SelectorRepuestos({ setProyecto, proyecto } : { setProyecto: (proyecto: Proyecto) => void, proyecto: Proyecto }) {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);

  const fetchRepuestos = async () => {
    const res = await fetch("/api/repuesto");
    const data = await res.json();
    setRepuestos(data);
  };

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const handleRepuestoChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      const values = repuestosSchema.parse(e.target.value.split(",").map((val) => parseInt(val.trim())));
      setProyecto((prev) => ({ ...prev, [field]: values }));
    } catch (error) {
      console.error("Error en la validación de repuestos:", error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Label htmlFor="idRepuestos">ID Repuestos (separados por comas)</Label>
        <Input id="idRepuestos" name="idRepuestos" type="text" onChange={(e) => handleRepuestoChange(e, "idRepuestos")} placeholder="Ejemplo: 1, 2, 3" />
      </div>
    </>
  );
}
