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
import { RepuestoCard } from "@/components/RepuestoCard";
import { useState } from "react";
import { Combobox } from "@/components/Combobox";
import { PictureCard } from "@/components/PictureCard";

interface RepuestoDataType {
  idRepuesto: string;
  nombre: string;
  descripcion: string;
  imgPic: string;
  currentAmount: number;
  totalAmount: number;
  amountNeeded: number;
}

const REPUESTOS: RepuestoDataType[] = [
  {
    idRepuesto: "R001",
    nombre: "Filtro de Aceite",
    descripcion: "Filtro de aceite de alta eficiencia para motores diésel.",
    imgPic: "https://example.com/images/filtro_aceite.jpg",
    currentAmount: 25,
    totalAmount: 50,
    amountNeeded: 10,
  },
  {
    idRepuesto: "R002",
    nombre: "Bomba Hidráulica",
    descripcion: "Bomba hidráulica para sistemas de maquinaria pesada.",
    imgPic: "https://example.com/images/bomba_hidraulica.jpg",
    currentAmount: 10,
    totalAmount: 30,
    amountNeeded: 15,
  },
  {
    idRepuesto: "R003",
    nombre: "Válvula de Control",
    descripcion: "Válvula de control para sistemas neumáticos.",
    imgPic: "https://example.com/images/valvula_control.jpg",
    currentAmount: 40,
    totalAmount: 100,
    amountNeeded: 20,
  },
  {
    idRepuesto: "R004",
    nombre: "Tubo Conector",
    descripcion: "Tubo de conexión para circuitos hidráulicos.",
    imgPic: "https://example.com/images/tubo_conector.jpg",
    currentAmount: 70,
    totalAmount: 150,
    amountNeeded: 30,
  },
  {
    idRepuesto: "R005",
    nombre: "Manómetro Digital",
    descripcion: "Manómetro digital de alta precisión.",
    imgPic: "https://example.com/images/manometro_digital.jpg",
    currentAmount: 5,
    totalAmount: 20,
    amountNeeded: 10,
  },
];

export function InterfazAsignacionRepuestos({
  idProyecto,
}: {
  idProyecto: string;
}) {
  const [repuestos, setRepuestos] = useState<RepuestoDataType[]>(REPUESTOS);
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
                      imageSrc={repuesto.imgPic}
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
                      {repuesto.currentAmount}
                      {repuesto.totalAmount && `/${repuesto.totalAmount}`}
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
