"use client";
import { useRouter } from "next/navigation";
import { Card, CardDescription } from "@components/ui/card";
import { ProyectoHeader } from "@components/ProyectoHeader";
import { Proyecto } from "@/models/proyecto";

export function ProyectosList({
  proyectos,
}: {
  proyectos: Proyecto[];
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((proyecto) => (
        <Card
          key={proyecto.idProyecto}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 hover:cursor-pointer flex flex-col justify-between h-full"
          onClick={() => {
            router.push(`/proyectos/${proyecto.idProyecto}`);
          }}
        >
          <div>
            <ProyectoHeader proyecto={proyecto} showSeeDetailsBtn={false} />
          </div>
          <CardDescription className="mt-auto">
            <div className="text-lg">
              {proyecto.descripcion}
            </div>
            <div className="flex justify-end">
              {proyecto.etapaActual}
            </div>
          </CardDescription>
        </Card>
      ))}
    </div>
  );
}
