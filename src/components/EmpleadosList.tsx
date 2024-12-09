import { EmpleadoForm } from "@/models/empleado";
import Image from "next/image";

interface EmpleadoListProps<T extends EmpleadoForm> {
  messageNothingAdded: string;
  empleados: T[];
  className?: string;
  selector?: (index: number, item: T) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function EmpleadosList<T extends EmpleadoForm>({
  messageNothingAdded,
  empleados,
  className,
  selector,
  error,
}: EmpleadoListProps<EmpleadoForm>) {
  return (
    <div className={`mx-3 ${className}`} style={{ height: "40h" }}>
      {empleados.length === 0 ? (
        <p className="w-full text-center">{messageNothingAdded}</p>
      ) : (
        empleados.map((item, index) => (
          <div key={item.idEmpleado} className="pt-4 w-full">
            <div className="flex rounded-md border shadow-sm justify-between items-center p-4 bg-white">
              {/* Imagen */}
              <div className="w-16 h-16 rounded-full overflow-hidden relative bg-gray-200 border border-gray-300 shadow">
                <Image
                  src={item.linkImg!}
                  alt={`Foto de ${item.nombre}`}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Información del empleado */}
              <div className="flex-1 flex flex-col pl-4">
                <p className="text-lg font-medium leading-none text-gray-800">
                  {`${item.nombre} ${item.apellido}`}
                </p>
                <p className="text-sm text-gray-600">{item.correo}</p>
              </div>
              {/* Selector opcional */}
              {selector && (
                <div className="ml-auto">
                  {selector(index, item as T)}
                </div>
              )}
            </div>
            {/* Mensaje de error */}
            {error && error(index)}
          </div>
        ))
      )}
    </div>
  );
}