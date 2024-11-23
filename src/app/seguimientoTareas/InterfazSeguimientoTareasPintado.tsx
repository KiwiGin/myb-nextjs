import { Button } from "@/components/ui/button";
import { ProyectoTecnico } from "@/models/proyecto";

export function InterfazSeguimientoTareasPintado({
  proyecto,
  idEmpleado,
}: {
  proyecto: ProyectoTecnico;
  idEmpleado: string;
}) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Empleado", idEmpleado);
    console.log("Proyecto:", proyecto.idProyecto);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex flex-row justify-center py-7"
    >
      <Button type="submit" className="sm:w-1/2 lg:w-1/4">
        Completar Tarea de pintado y embalado
      </Button>
    </form>
  );
}
