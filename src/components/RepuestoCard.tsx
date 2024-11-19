// RepuestoCard.tsx
import Image from 'next/image';
import { Repuesto } from "@/models/repuesto";
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
    <div className="flex items-center space-x-6 border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      {repuesto.linkImg ? (
        <Image
          src={repuesto.linkImg}
          alt={repuesto.nombre}
          width={100}
          height={100}
          className="w-24 h-24 object-cover rounded-md"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md text-gray-600">
          <span>Sin imagen</span>
        </div>
      )}
      
      <div className="flex-1">
        <Label className="text-lg font-semibold text-gray-800">{repuesto.nombre} - S/ {repuesto.precio}</Label>
        <p className="text-gray-600 mt-1">
          {repuesto.descripcion.length > 100 ? `${repuesto.descripcion.substring(0, 80)}...` : repuesto.descripcion}
        </p>
      </div>
      
      <div className='flex flex-col items-end'>
        {isSelected && (
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => onCantidadChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cantidad"
          />
        )}
        
        <button
          type="button"
          onClick={onToggle}
          className={`py-2 px-4 rounded-md font-medium transition-colors duration-200 w-full ${
            isSelected ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isSelected ? "Quitar" : "Añadir"}
        </button>
        
      </div>
    </div>
  );
}
