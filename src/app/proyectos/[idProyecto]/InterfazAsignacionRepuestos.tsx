import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Repuesto } from "@/models/repuesto";
import { Proyecto } from "@/models/proyecto";
import { Modal } from "@/components/Modal";
import { RepuestosList } from "@/components/RepuestosList";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";

export function InterfazAsignacionRepuestos({
  proyecto,
}: {
  proyecto: Proyecto;
}) {
  const [repuestos] = useState<Repuesto[]>(proyecto.repuestos || []);
  const [available, setAvaible] = useState<string>("Disponibles");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noice, setNoice] = useState<NoiceType | null>(null);

  useEffect(() => {
    if (
      repuestos.some(
        (repuesto) => repuesto.stockDisponible! < repuesto.cantidad!
      )
    ) {
      setAvaible("No disponibles");
    } else {
      setAvaible("Disponibles");
    }
  }, [repuestos]);

  const pedirRepuestos = async () => {
    setNoice({
      type: "loading",
      message: "Solicitando repuestos...",
      styleType: "modal",
    });

    try {
      const pedido = repuestos
        .filter((repuesto) => repuesto.stockDisponible! < repuesto.cantidad!)
        .map((repuesto) => ({
          idRepuesto: repuesto.idRepuesto,
          cantidadSolicitada: repuesto.cantidad! - repuesto.stockDisponible!,
        }));

      // POST /api/repuesto/solicitados
      const response = await fetch("/api/repuesto/solicitados", {
        method: "POST",
        body: JSON.stringify(pedido),
      });

      if (!response.ok) throw new MyBError("Error al solicitar repuestos");

      await response.json();

      setNoice({
        type: "success",
        message: "Repuestos solicitados con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error", message: "Error al solicitar repuestos" });
      console.error(error);
    }
  };

  const asignarRepuestos = async () => {
    setNoice({
      type: "loading",
      message: "Asignando repuestos...",
      styleType: "modal",
    });

    try {
      // PUT /api/proyecto/repuesto/asignar
      const response = await fetch(`/api/proyecto/repuesto/asignar`, {
        method: "PUT",
        body: JSON.stringify({ proyectoId: proyecto.idProyecto }),
      });

      if (!response.ok) throw new MyBError("Error al asignar repuestos");

      await response.json();

      setNoice({
        type: "success",
        message: "Repuestos asignados con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else setNoice({ type: "error", message: "Error al solicitar repuestos" });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {noice && <Noice noice={noice} />}
      <div className="flex justify-center items-center gap-4 w-full">
        <p
          className={`font-bold ${
            available === "Disponibles" || available === "Pedidos"
              ? "text-green-500"
              : "text-red-600"
          }`}
        >
          {available === "Disponibles" && "Repuestos disponibles"}
          {available === "Pedidos" && "Esperando repuestos"}
          {available === "No disponibles" && "Repuestos no disponibles"}
        </p>

        <Button onClick={() => setIsDialogOpen(true)} variant="outline">
          Ver repuestos
        </Button>

        <Modal
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
        >
          <div className="sm:max-w-[800px] sm:max-h-[800px]">
            <RepuestosList
              messageNothingAdded="No hay repuestos"
              repuestos={repuestos}
              className="w-full"
            />
            {available === "No disponibles" && (
              <Button
                onClick={() => {
                  pedirRepuestos();
                  setIsDialogOpen(false);
                }}
              >
              Pedir repuestos
            </Button>
            )}
          </div>
        </Modal>
      </div>
      <Button
        onClick={asignarRepuestos}
        disabled={available !== "Disponibles"}
        className="w-full"
      >
        Asignar repuestos
      </Button>
    </div>
  );
}
