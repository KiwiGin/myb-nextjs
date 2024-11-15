import { paObtenerEmpleados } from '@/backend/dataBaseUtils/empleadoDA';
import { NextResponse } from 'next/server';
import { Empleado } from '@/models/empleado';

export async function GET(): Promise<NextResponse<Empleado[]>> {
    const empleados: Empleado[] = await paObtenerEmpleados();
    return NextResponse.json(empleados);
}