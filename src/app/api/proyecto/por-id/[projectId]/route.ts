import { obtenerProyectoPorId } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Proyecto } from '@/models/proyecto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const { projectId } = params;

  try {
    // Ejecuta la función para obtener datos de proyecto por id
    const proyecto: Proyecto = await obtenerProyectoPorId(Number(projectId));

    // Retorna los datos de proyecto como JSON
    return NextResponse.json(proyecto);
  } catch (error) {
    console.error("Error al obtener datos de proyecto:", error);
    return NextResponse.json({ error: 'Error al obtener datos de proyecto' }, { status: 500 });
  }
}