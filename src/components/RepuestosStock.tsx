"use client";
import { RepuestoForm } from "@/models/repuesto";
import { Modal } from "@components/Modal";
import { RepuestosList } from "@components/RepuestosList";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";

interface RepuestosStockProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  repuestos: RepuestoForm[];
  handleSelectRepuesto: (prueba: RepuestoForm) => void;
  handleUnselectRepuesto: (prueba: RepuestoForm) => void;
}

export function RepuestosStock({
  open,
  setOpen,
  repuestos,
  handleSelectRepuesto,
  handleUnselectRepuesto,
}: RepuestosStockProps) {

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} className="">
      <div className="w-full flex items-center">
        <h2 className="text-3xl font-extrabold my-2 dark:text-white">
          Selecciona los repuestos
        </h2>
      </div>

      <div
        className="overflow-y-auto flex-col items-center"
        style={{ maxHeight: "80vh", maxWidth: "75vw" }}
      >
        <RepuestosList
          repuestos={repuestos}
          messageNothingAdded="No hay repuestos seleccionados"
          selector={(index, item) => (
            <div className="flex h-full items-center gap-2">
              <Switch
                id={item.idRepuesto?.toString()}
                checked={item.checked}
                onClick={() => {
                  if (!item.checked) {
                    handleSelectRepuesto(item);
                  } else {
                    handleUnselectRepuesto(item);
                  }
                }}
              />
            </div>
          )}
        />
      </div>
      <div className="w-full flex items-center justify-center py-4">
        <Button className="w-1/2" onClick={() => setOpen(false)}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}
