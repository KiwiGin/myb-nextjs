// RepuestoCard.tsx
import Image from 'next/image';
import { Repuesto } from "@/models/repuesto"; // Asegúrate de importar el tipo Repuesto
import { Label } from "@/components/ui/label";

interface RepuestoCardProps {
  repuesto: Repuesto;
  onToggle: () => void;
  isSelected: boolean;
  cantidad: number;
  onCantidadChange: (cantidad: number) => void;
}

export function RepuestoCard({
  repuesto,
  onToggle,
  isSelected,
  cantidad,
  onCantidadChange,
}: RepuestoCardProps) {
  return (
    <div className="flex items-center space-x-4 border rounded p-2">
      {repuesto.link_img ? (
        <Image
          src={repuesto.link_img}
          alt={repuesto.nombre}
          width={100}
          height={100}
          className="w-24 h-24 object-cover"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
          <span>Sin imagen</span>
        </div>
      )}
      <div>
        <Label>{repuesto.nombre} - ${repuesto.precio}</Label>
        <p className="text-sm">{repuesto.descripcion}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`p-1 px-4 rounded ${isSelected ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
      >
        {isSelected ? "Quitar" : "Añadir"}
      </button>
      {isSelected && (
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => onCantidadChange(Number(e.target.value))}
          className="border rounded p-1 w-16"
        />
      )}
    </div>
  );
}
