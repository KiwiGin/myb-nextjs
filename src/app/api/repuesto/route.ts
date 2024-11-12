// app/api/repuesto/route.ts
import { actualizarStockRepuesto, obtenerRepuestos, registrarRepuesto } from '@/backend/dataBaseUtils/repuestoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Repuesto } from '@/models/repuesto';

export async function POST(req: NextRequest) {
    const repuesto: Repuesto = await req.json();
    await registrarRepuesto(repuesto);
    return NextResponse.json({ message: 'Repuesto insertado exitosamente' });
}

export async function GET() {
    const repuestos = await obtenerRepuestos();
    return NextResponse.json(repuestos);
}

//put
export async function PUT(req: NextRequest) {
    const repuesto: Repuesto = await req.json();
    await actualizarStockRepuesto(repuesto);
    return NextResponse.json({ message: 'Repuesto actualizado exitosamente' });
}