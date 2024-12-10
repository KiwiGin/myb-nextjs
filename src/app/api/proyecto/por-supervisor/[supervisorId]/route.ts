import { obtenerProyectosPorSupervisor } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Proyecto } from '@/models/proyecto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { supervisorId: string } }) {
  const { supervisorId } = params;

  try {
    // Ejecuta la función para obtener proyectos por jefe
    const proyectos: Proyecto[] = await obtenerProyectosPorSupervisor(Number(supervisorId));

    // Retorna los proyectos como JSON
    return NextResponse.json(proyectos);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}