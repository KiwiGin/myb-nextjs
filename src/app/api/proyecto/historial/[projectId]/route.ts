import { obtenerHistorialProyecto } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';
import { HistorialProyecto } from '@/models/proyecto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const { projectId } = params;

  try {
    // Ejecuta la función para obtener datos de proyecto por id
    const historialProyecto: HistorialProyecto = await obtenerHistorialProyecto(Number(projectId));

    // Retorna los datos de proyecto como JSON
    return NextResponse.json(historialProyecto);
  } catch (error) {
    console.error("Error al obtener datos del historial del proyecto:", error);
    return NextResponse.json({ error: 'Error al obtener datos del historial del proyecto' }, { status: 500 });
  }
}