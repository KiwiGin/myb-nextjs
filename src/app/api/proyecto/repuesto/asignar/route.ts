import { asignarRepuestosAProyecto } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    const { proyectoId } = await req.json();
    await asignarRepuestosAProyecto(proyectoId);
    return NextResponse.json({ message: 'Repuestos asignados exitosamente' });
}