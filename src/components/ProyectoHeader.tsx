"use client";
import { ProyectoDataType } from "@/app/proyectos/InterfazListaProyectos";
import { PictureCard } from "@components/PictureCard";

export function ProyectoHeader({
  proyecto,
  showSeeMore = true,
}: {
  proyecto: ProyectoDataType;
  showSeeMore?: boolean;
}) {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-col gap-4 items-start w-3/4">
        <h1 className="font-bold text-3xl">{proyecto.titulo}</h1>
        <div>
          <h4 className="text-xl">{proyecto.cliente}</h4>
          {/*{ showSeeMore && <ProjectSeeMoreModal project={project} /> } */}
        </div>
      </div>
      <div className="flex gap-2 h-20 self-start">
        {proyecto.empleados.map((empleado) => (
          <PictureCard
            key={empleado.nombre}
            name={empleado.nombre}
            imageSrc={empleado.profilePic}
          />
        ))}
      </div>
    </div>
  );
}
