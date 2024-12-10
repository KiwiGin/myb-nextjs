import { NextRequest, NextResponse } from 'next/server';
import { Repuesto } from '@/models/repuesto';
import { obtenerRepuestosFaltantesPorJefe } from '@/backend/dataBaseUtils/repuestoDA';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { jefeId: string } }) {
    const { jefeId } = params;

    const repuestosFaltantes: {repuesto: Repuesto, cantidadFaltante: number}[] = await obtenerRepuestosFaltantesPorJefe(Number(jefeId));
    return NextResponse.json(repuestosFaltantes);
}