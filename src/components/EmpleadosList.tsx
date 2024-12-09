import { EmpleadoForm } from "@/models/empleado";
import { EmpleadoPictureCard } from "./EmpleadoPictureCard";

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
        empleados.map((empleado, index) => (
          <div key={empleado.idEmpleado} className="pt-4 w-full">
            <div className="flex rounded-md border shadow-sm justify-between items-center p-4 bg-white">
              {/* Imagen */}
              <EmpleadoPictureCard empleado={empleado} />
              {/* Información del empleado */}
              <div className="flex-1 flex flex-col pl-4">
                <p className="text-lg font-medium leading-none text-gray-800">
                  {`${empleado.nombre} ${empleado.apellido}`}
                </p>
                <p className="text-sm text-gray-600">{empleado.correo}</p>
              </div>
              {/* Selector opcional */}
              {selector && (
                <div className="ml-auto">
                  {selector(index, empleado as T)}
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