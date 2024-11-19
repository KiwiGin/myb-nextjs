import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { PictureCard } from "@/components/PictureCard";
import { Repuesto } from "@/models/repuesto";
import { REPUESTOS } from "@/models/MOCKUPS";
import { Proyecto } from "@/models/proyecto";

export function InterfazAsignacionRepuestos({
  proyecto,
}: {
  proyecto: Proyecto;
}) {
  const [repuestos] = useState<Repuesto[]>(proyecto.repuestos || []);
  const [available, setAvaible] = useState<string>("Disponibles");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (repuestos.some((repuesto) => repuesto.stockDisponible! < repuesto.cantidad!)) {
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
  }

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Ver Respuestos</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] sm:max-h-[800px]">
            <DialogHeader>
              <DialogTitle>Repuestos Faltantes</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col w-full items-center">
              {repuestos.map((repuesto) => (
                <div
                  key={repuesto.idRepuesto}
                  className={`w-full flex flex-row justify-between items-center gap-4 px-4 shadow-md`}
                >
                  <div className="h-full w-full flex flex-row gap-2 py-4 items-center">
                    <PictureCard
                      imageSrc={
                        repuesto.linkImg ||
                        "https://avatar.iran.liara.run/public/6"
                      }
                      name={repuesto.nombre}
                      className="w-1/4"
                    />
                    <div className="flex flex-col self-start items-start gap-1 w-3/4">
                      <h1 className="text-xl font-bold">{repuesto.nombre}</h1>
                      <p>{repuesto.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-self-end gap-2 px-3">
                    <p className="text-4xl font-extralight">
                      {repuesto.stockDisponible}
                      {repuesto.cantidad &&
                        `/${repuesto.cantidad}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              {available === "No disponibles" && (
                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => {
                    pedirRepuestos();
                    setIsDialogOpen(false);
                  }}
                >
                  Pedir
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Button onClick={asignarRepuestos} disabled={available !== "Disponibles"} className="w-full">
        Asignar repuestos
      </Button>
    </div>
  );
}
