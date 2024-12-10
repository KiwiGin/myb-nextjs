"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./Modal";

interface InformeSectionProps {
  informeLabel: string;
  actualizarEtapa: () => Promise<void>;
  canUpdateStage: boolean;
  children?: React.ReactNode;
}

export function InformeSection({
  informeLabel,
  actualizarEtapa,
  canUpdateStage,
  children,
}: InformeSectionProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className="min-w-32"
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
          {canUpdateStage && (
            <Button
              onClick={async () => {
                setOpen(false);
                await actualizarEtapa();
              }}
            >
              {informeLabel === "Informe de Ventas"
                ? "Cerrar Proyecto"
                : "Actualizar Etapa"}
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
