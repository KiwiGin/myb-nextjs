import { asignarEmpleadosAProyecto } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
    const data : {
      idProyecto: number;
      idEmpleados: number[];
      fechaAsignacion: Date;
    } = await req.json();
    await asignarEmpleadosAProyecto(data);
    return NextResponse.json({ message: 'Empleados asignados exitosamente' });
}