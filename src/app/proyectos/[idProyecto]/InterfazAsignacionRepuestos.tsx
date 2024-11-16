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
import { useState } from "react";
import { Combobox } from "@/components/Combobox";
import { PictureCard } from "@/components/PictureCard";
import { Repuesto } from "@/models/repuesto";

export const REPUESTOS: Repuesto[] = [
  {
    idRepuesto: 1,
    nombre: "Filtro de Aceite",
    precio: 35.5,
    descripcion: "Filtro de aceite de alta calidad para vehículos ligeros.",
    link_img: "https://example.com/images/filtro_aceite.jpg",
    stock_actual: 50,
    stock_solicitado: 10,
    cantidad: 5,
  },
  {
    idRepuesto: 2,
    nombre: "Bujía de Encendido",
    precio: 12.75,
    descripcion: "Bujía estándar para motores de gasolina.",
    link_img: null,
    img_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAU=",
    stock_actual: 200,
    stock_solicitado: 15,
    cantidad: 20,
  },
  {
    idRepuesto: 3,
    nombre: "Filtro de Aire",
    precio: 25.0,
    descripcion: "Filtro de aire compatible con la mayoría de los automóviles.",
    link_img: "https://example.com/images/filtro_aire.jpg",
    stock_actual: 75,
    stock_solicitado: 25,
    cantidad: 10,
  },
  {
    idRepuesto: 4,
    nombre: "Pastillas de Freno",
    precio: 80.0,
    descripcion: "Pastillas de freno para vehículos medianos.",
    link_img: null,
    stock_actual: 100,
    stock_solicitado: 50,
    cantidad: 15,
  },
  {
    idRepuesto: 5,
    nombre: "Aceite de Motor 5W-30",
    precio: 45.99,
    descripcion: "Aceite sintético de alta durabilidad.",
    link_img: "https://example.com/images/aceite_motor.jpg",
    stock_actual: 30,
    stock_solicitado: 20,
    cantidad: 8,
  },
];

export function InterfazAsignacionRepuestos({
  idProyecto,
}: {
  idProyecto: string;
}) {
  const [repuestos, setRepuestos] = useState<Repuesto[]>(REPUESTOS);
  const [available, setAvaible] = useState<string>("Disponibles");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Combobox
        items={["Disponibles", "Pedidos", "No disponibles"]}
        getValue={(r) => r}
        getLabel={(r) => r}
        getRealValue={(r) => r}
        onSelection={(r) => {
          setAvaible(r);
        }}
        itemName={"Estado"}
      />
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
                        repuesto.link_img ||
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
                      {repuesto.stock_actual}
                      {repuesto.stock_solicitado &&
                        `/${repuesto.stock_solicitado}`}
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
                    // TODO: send request to backend to order repuestos
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
      <Button disabled={available !== "Disponibles"} className="w-full">
        Asignar repuestos
      </Button>
    </div>
  );
}
