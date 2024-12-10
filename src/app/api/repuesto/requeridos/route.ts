import { NextResponse } from 'next/server';
import { Repuesto } from '@/models/repuesto';
import { obtenerRepuestosRequeridos } from '@/backend/dataBaseUtils/repuestoDA';

export const dynamic = 'force-dynamic';

export async function GET() {
    const repuestos: Repuesto[] = await obtenerRepuestosRequeridos();

    const response = NextResponse.json(repuestos);

    return response;
}
