import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Repuesto } from "@/models/repuesto";
import { Proyecto } from "@/models/proyecto";
import { Modal } from "@/components/Modal";
import { RepuestosList } from "@/components/RepuestosList";

export function InterfazAsignacionRepuestos({
  proyecto,
}: {
  proyecto: Proyecto;
}) {
  const [repuestos] = useState<Repuesto[]>(proyecto.repuestos || []);
  const [available, setAvaible] = useState<string>("Disponibles");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    if (!response.ok) {
      console.error("Error al pedir repuestos");
      return;
    }

    const data = await response.json();
    console.log(data);
  };

  const asignarRepuestos = async () => {
    // PUT /api/proyecto/repuesto/asignar
    const response = await fetch(`/api/proyecto/repuesto/asignar`, {
      method: "PUT",
      body: JSON.stringify({ proyectoId: proyecto.idProyecto }),
    });

    if (!response.ok) {
      console.error("Error al asignar repuestos");
      return;
    }

    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
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
            <Button
              onClick={() => {
                pedirRepuestos();
                setIsDialogOpen(false);
              }}
            >
              Pedir repuestos
            </Button>
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
