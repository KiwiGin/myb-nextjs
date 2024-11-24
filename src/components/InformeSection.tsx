import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./Modal";

interface InformeSectionProps {
  informeLabel: string;
  handleGenerar: () => Promise<void>;
}

export function InformeSection({
  informeLabel,
  handleGenerar,
}: InformeSectionProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={async () => {
          handleGenerar().then(() => {
            setOpen(true);
          });
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
      >
        <div className="flex flex-col gap-2 items-center max-h-80vh">
          <h1>{informeLabel}</h1>
          <Button
            className="w-2/3 lg:min-w-10 lg:max-w-full"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
}
