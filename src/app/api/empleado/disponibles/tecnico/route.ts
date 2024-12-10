import { obtenerTecnicosDisponibles } from '@/backend/dataBaseUtils/empleadoDA';
import { NextResponse } from 'next/server';
import { Empleado } from '@/models/empleado';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<Empleado[]>> {
    const empleados: Empleado[] = await obtenerTecnicosDisponibles();
    return NextResponse.json(empleados);
}