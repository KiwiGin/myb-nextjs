"use client";
import React from "react";
import { Proyecto } from "@/models/proyecto";
import { ProyectosList } from "@/components/ProyectosList";

export type EmpleadoDataType = {
  nombre: string;
  profilePic: string;
};

export type ProyectoDataType = Pick<Proyecto, "titulo" | "descripcion"> & {
  idProyecto: string;
  cliente: string;
  etapa: number;
  empleados: EmpleadoDataType[];
};

export const PROYECTOS = [
  {
    titulo: "Construcción de Puente",
    descripcion:
      "Proyecto para la construcción de un puente vehicular en la región sur.",
    idProyecto: "20123456789",
    cliente: "Municipalidad de Lima",
    etapa: 0,
    empleados: [
      {
        nombre: "Juan Pérez",
        profilePic: "https://avatar.iran.liara.run/public/1",
      },
    ],
  },
  {
    titulo: "Instalación de Sistema Hidráulico",
    descripcion:
      "Configuración e instalación de un sistema hidráulico en una planta industrial.",
    idProyecto: "20234567890",
    cliente: "Industrias del Sur",
    etapa: 2,
    empleados: [
      {
        nombre: "María González",
        profilePic: "https://avatar.iran.liara.run/public/37",
      },
    ],
  },
  {
    titulo: "Mantenimiento de Equipos Mineros",
    descripcion:
      "Programa de mantenimiento preventivo de maquinaria minera en el norte.",
    idProyecto: "20345678901",
    cliente: "Minerales del Norte",
    etapa: 3,
    empleados: [
      {
        nombre: "Carlos Sánchez",
        profilePic: "https://avatar.iran.liara.run/public/22",
      },
    ],
  },
  {
    titulo: "Optimización de Red Neumática",
    descripcion:
      "Optimización de la red neumática de una planta de ensamblaje.",
    idProyecto: "20456789012",
    cliente: "Ensamblajes S.A.",
    etapa: 4,
    empleados: [
      {
        nombre: "José Rodríguez",
        profilePic: "https://avatar.iran.liara.run/public/30",
      },
    ],
  },
] as ProyectoDataType[];

export function InterfazListaProyectos() {
  /*
    Llamada a la api
    let proyectos = await fetch("http://localhost:3000/api/proyectos/porJefeID")
  */
  const proyectos = PROYECTOS;
  return (
    <div className="p-4">
      <ProyectosList proyectos={proyectos} />
    </div>
  );
}
