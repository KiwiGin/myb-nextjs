"use client";
import { useRouter } from "next/navigation";
import { Card, CardDescription } from "@components/ui/card";
import { ProyectoDataType } from "@/app/proyectos/InterfazListaProyectos";
import { ProyectoHeader } from "@components/ProyectoHeader";

export function ProyectosList({
  proyectos,
}: {
  proyectos: ProyectoDataType[];
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((proyecto) => (
        <Card
          key={proyecto.idProyecto}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 hover:cursor-pointer"
          onClick={() => {
            router.push(`/proyectos/${proyecto.idProyecto}`);
          }}
        >
          <ProyectoHeader proyecto={proyecto} />
          <CardDescription>{proyecto.descripcion}</CardDescription>
        </Card>
      ))}
    </div>
  );
}
