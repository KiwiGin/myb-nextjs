import { cambiarEtapaProyecto } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
    const proyecto: {idProyecto: number, idEtapa: number, fechaInicio: Date } = await req.json();
    await cambiarEtapaProyecto(proyecto.idProyecto, proyecto.idEtapa, proyecto.fechaInicio);
    return NextResponse.json({ message: 'Etapa de proyecto cambiada exitosamente' });
}