// - `POST` a `/proyecto/reparando`

import { registrarResultados } from "@/backend/dataBaseUtils/proyectoDA";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  type ResultadosPruebaForm = {
      idProyecto: number;
      idEmpleado: number;
      fecha: Date;
      resultados: {
        idTipoPrueba: number;
        especificaciones: {
          idParametro: number;
          resultado: number;
        }[]
      }[]
    }
  const jsonData : ResultadosPruebaForm = await req.json();
  await registrarResultados(jsonData);
  return NextResponse.json({ message: 'Resultados registrados exitosamente' });
}