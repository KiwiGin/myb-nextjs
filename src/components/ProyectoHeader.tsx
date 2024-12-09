"use client";
import { Proyecto } from "@/models/proyecto";
import { useState } from "react";
import ProjectDetailsModal from "./ProyectDetailsModal";
import { Button } from "./ui/button";

export function ProyectoHeader({ proyecto }: { proyecto: Proyecto }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <ProjectDetailsModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        proyecto={proyecto}
      />
      <div className="flex flex-col gap-4 items-start w-3/4">
        <div className="flex flex-row space-x-4">
          <h1 className="font-bold text-3xl">{proyecto.titulo}</h1>
          <Button onClick={() => setDialogOpen(true)}>Ver Detalles</Button>
        </div>
        <h4 className="text-xl">{proyecto.cliente?.nombre}</h4>
      </div>
      {/* <div className="flex gap-2 h-20 self-start">
        {proyecto.empleados?.map((empleado) => (
          <PictureCard
            key={empleado.nombre}
            name={empleado.nombre}
            imageSrc={empleado.profilePic}
          />
        ))}
      </div> */}
    </div>
  );
}
