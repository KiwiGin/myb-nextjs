import { asignarRepuestosAProyecto, cambiarEtapaProyecto } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
    const { proyectoId } = await req.json();
    await asignarRepuestosAProyecto(proyectoId);
    await cambiarEtapaProyecto(proyectoId, 2, new Date());
    return NextResponse.json({ message: 'Repuestos asignados exitosamente' });
}