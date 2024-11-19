import { NextResponse } from 'next/server';
import { Repuesto } from '@/models/repuesto';
import { obtenerRepuestosRequeridos } from '@/backend/dataBaseUtils/repuestoDA';

export async function GET() {
    const repuestos: Repuesto[] = await obtenerRepuestosRequeridos();
    return NextResponse.json(repuestos);
}