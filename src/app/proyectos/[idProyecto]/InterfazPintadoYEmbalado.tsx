import { Proyecto } from "@/models/proyecto";

interface InterfazPintadoYEmbaladoProps {
  proyecto: Proyecto;
}

export function InterfazPintadoYEmbalado({
  proyecto,
}: InterfazPintadoYEmbaladoProps) {
  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <h1 className="text-2xl font-bold">Pintando y embalando</h1>
    </div>
  );
}
