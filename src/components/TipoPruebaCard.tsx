import { TipoPrueba } from "@/models/tipoprueba";
import { Label } from "@/components/ui/label";

interface TipoPruebaCardProps {
  prueba: TipoPrueba;
  onToggle: () => void;
  isSelected: boolean;
  valoresMaximos: number[];
  valoresMinimos: number[];
  onValorChange: (parametroId: number, valor: number, tipo: "max" | "min") => void;
}

export function TipoPruebaCard({
  prueba,
  onToggle,
  isSelected,
  valoresMaximos,
  valoresMinimos,
  onValorChange,
}: TipoPruebaCardProps) {
  return (
    <div className="flex flex-col border rounded p-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">{prueba.nombre}</Label>
        <button
          type="button"
          onClick={onToggle}
          className={`p-1 px-4 rounded ${isSelected ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
        >
          {isSelected ? "Quitar" : "Añadir"}
        </button>
      </div>
      {isSelected && (
        <div className="space-y-2">
          {prueba.parametros?.map((parametro, index) => (
            <div key={parametro.idParametro} className="flex items-center space-x-4">
              <Label>{parametro.nombre} ({parametro.unidades})</Label>
              <input
                type="number"
                placeholder="Mín"
                min="0"
                value={valoresMinimos[index] || 0}
                onChange={(e) => onValorChange(parametro.idParametro!, Number(e.target.value), "min")}
                className="border rounded p-1 w-16"
              />
              <input
                type="number"
                placeholder="Máx"
                min="0"
                value={valoresMaximos[index] || 0}
                onChange={(e) => onValorChange(parametro.idParametro!, Number(e.target.value), "max")}
                className="border rounded p-1 w-16"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
