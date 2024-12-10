"use client";
import { TipoPruebaForms } from "@/models/tipoprueba";
import { Modal } from "@components/Modal";
import { PruebasList } from "@components/PruebasList";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";

interface PruebasStockProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pruebas: TipoPruebaForms[];
  handleSelectPrueba: (prueba: TipoPruebaForms) => void;
  handleUnselectPrueba: (prueba: TipoPruebaForms, index: number) => void;
}

export default function PruebasStock({
  open,
  setOpen,
  pruebas,
  handleSelectPrueba,
  handleUnselectPrueba,
}: PruebasStockProps) {
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} className="">
      <div className="w-full flex items-center">
        <h2 className="text-3xl font-extrabold my-2 dark:text-white">
          Selecciona las pruebas
        </h2>
      </div>

      <div
        className="overflow-y-auto flex-col items-center"
        style={{ maxHeight: "80vh", maxWidth: "75vw" }}
      >
        <PruebasList
          className="grid grid-cols-1 gap-10"
          pruebas={pruebas}
          messageNothingAdded="No hay pruebas seleccionadas"
          selector={(index, item) => (
            <div className="flex h-full items-center gap-2">
              <Switch
                id={item.idTipoPrueba?.toString()}
                checked={item.checked}
                onClick={() => {
                  if (!item.checked) {
                    handleSelectPrueba(item);
                  } else {
                    handleUnselectPrueba(item, index);
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
