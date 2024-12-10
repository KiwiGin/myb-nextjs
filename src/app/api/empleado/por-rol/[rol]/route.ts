import { NextRequest, NextResponse } from 'next/server';
import { paObtenerEmpleadosPorRol } from '@/backend/dataBaseUtils/empleadoDA';
import { Empleado } from '@/models/empleado';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { rol: string } }) {
  const { rol } = params;

  try {
    // Ejecuta la función para obtener empleados por rol
    const empleados: Empleado[] = await paObtenerEmpleadosPorRol(rol);

    // Retorna los empleados como JSON
    return NextResponse.json(empleados);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 });
  }
}
