import { obtenerProyectoPorTecnico } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Proyecto } from '@/models/proyecto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { tecnicoId: string } }) {
  const { tecnicoId } = params;

  try {
    // Ejecuta la función para obtener proyectos por jefe
    const proyecto: Proyecto = await obtenerProyectoPorTecnico(Number(tecnicoId));

    // Retorna el proyecto como JSON
    return NextResponse.json(proyecto);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    return NextResponse.json({ error: 'Error al obtener proyecto' }, { status: 500 });
  }
}