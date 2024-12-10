"use client";

import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import { Button } from "@/components/ui/button";
import { Logout } from "@/components/icons/Logout";
import { authorizedRoutes } from "@/lib/auth";
import { EmpleadoPictureCard } from "@/components/EmpleadoPictureCard";
import { Empleado } from "@/models/empleado";

export default function Home() {
  const { data: session } = useSession();
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Estamos configurando algunas cosas...",
  });

  useEffect(() => {
    if (session) {
      setNoice(null);
    }
  }, [session]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-100">
      {noice && <Noice noice={noice} />}
      {session?.user.rol === "admin" ? (
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 lg:flex-row justify-center p-6 bg-white shadow-lg rounded-lg">
          {authorizedRoutes.admin.map((route) => (
            <Fragment key={route}>{getRoute(route)}</Fragment>
          ))}
        </div>
      ) : session?.user.rol === "jefe" ? (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
          {authorizedRoutes.jefe.map((route) => (
            <Fragment key={route}>{getRoute(route)}</Fragment>
          ))}
        </div>
      ) : session?.user.rol === "supervisor" ? (
        <div className="flex flex-col gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
          {authorizedRoutes.supervisor.map((route) => (
            <Fragment key={route}>{getRoute(route)}</Fragment>
          ))}
        </div>
      ) : session?.user.rol === "tecnico" ? (
        <div className="flex flex-col gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
          {authorizedRoutes.tecnico.map((route) => (
            <Fragment key={route}>{getRoute(route)}</Fragment>
          ))}
        </div>
      ) : (
        session?.user.rol === "logistica" && (
          <div className="flex flex-col gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
            {authorizedRoutes.logistica.map((route) => (
              <Fragment key={route}>{getRoute(route)}</Fragment>
            ))}
          </div>
        )
      )}
      <div className="absolute right-0 top-0 w-52 py-6 flex flex-row items-center">
        <div className="relative px-10">
          { session?.user && <EmpleadoPictureCard empleado={session?.user as Empleado} enableOnHoverInfo />}
        </div>
        <Button
          onClick={() => {
            signOut();
          }}
          size="icon"
          className="rounded-full bg-transparent hover:bg-transparent hover:scale-110 transition duration-300 ease-in-out"
        >
          <Logout />
        </Button>
      </div>
    </div>
  );
}

const getRoute = (path: string) => {
  switch (path) {
    case "/registroEmpleado":
      return (
        <a
          href="/registroEmpleado"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registrar Empleados
        </a>
      );
    case "/registroCliente":
      return (
        <a
          href="/registroCliente"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Cliente
        </a>
      );
    case "/registroProyecto":
      return (
        <a
          href="/registroProyecto"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Proyecto
        </a>
      );
    case "/registroPrueba":
      return (
        <a
          href="/registroPrueba"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Prueba
        </a>
      );
    case "/registroRepuesto":
      return (
        <a
          href="/registroRepuesto"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Registro de Repuesto
        </a>
      );
    case "/proyeccionRepuestos":
      return (
        <a
          href="/proyeccionRepuestos"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Proyección de repuestos
        </a>
      );
    case "/visualizacionRepuestos":
      return (
        <a
          href="/visualizacionRepuestos"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Visualización de repuestos requeridos
        </a>
      );
    case "/proyectos":
      return (
        <a
          href="/proyectos"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Seguimiento de proyectos
        </a>
      );
    case "/seguimientoTareas":
      return (
        <a
          href="/seguimientoTareas"
          className="p-4 flex justify-center items-center bg-black text-white rounded-lg hover:bg-black hover:scale-105 transition duration-300 ease-in-out"
        >
          Seguimiento de tareas
        </a>
      );
    default:
      return <Home />;
  }
};
