import { Proyecto } from "@/models/proyecto";

interface InterfazReparandoProps {
  proyecto: Proyecto;
}

export function InterfazReparando({
  proyecto,
}: InterfazReparandoProps) {
  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      <h1 className="text-2xl font-bold">Reparando</h1>
    </div>
  );
}
