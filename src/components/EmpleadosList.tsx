import { EmpleadoForm } from "@/models/empleado";
import { GenericCard } from "@components/GenericCard";

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
          <div key={item.idEmpleado} className="pt-2 w-full">
            <div className="flex rounded-md border justify-between">
              <div className="flex-col items-center space-x-4 p-4 max-h-32 w-full">
                <div className="w-full flex flex-row items-center">
                  <p className="text-lg font-medium leading-none">{`${item.nombre} ${item.apellido}`}</p>
                  <div className={"gap-4 min-w-14 ml-auto"}>
                    {selector && selector(index, item as T)}
                  </div>
                </div>
                <div className="flex-1 space-y-1 overflow-x-auto w-full">
                  <p className="text-base text-muted-foreground">
                    {item.correo}
                  </p>
                </div>
              </div>
            </div>
            {error && error(index)}
          </div>
        ))
      )}
    </div>
  );
}
