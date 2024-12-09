"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./Modal";

interface InformeSectionProps {
  informeLabel: string;
  actualizarEtapa: () => Promise<void>;
  children?: React.ReactNode;
}

export function InformeSection({
  informeLabel,
  actualizarEtapa,
  children,
}: InformeSectionProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className="w-2/3 lg:w-1/2 my-8"
      >
        Generar {informeLabel}
      </Button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        className="w-11/12 h-[90%]"
      >
        <div className="flex flex-col gap-2 items-center h-full w-full">
          <h1>{informeLabel}</h1>
          {children}
          <Button
            className="w-2/3 lg:min-w-10 lg:max-w-full"
            onClick={async () => {
              setOpen(false);
              await actualizarEtapa();
            }}
          >
            {informeLabel === "Informe de Ventas"
              ? "Cerrar Proyecto"
              : "Actualizar Etapa"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
