// app/api/hello/route.ts
import { obtenerPruebaConParametros } from '@/backend/dataBaseUtils/pruebaParametroDA';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const repuestos = await obtenerPruebaConParametros();
    return NextResponse.json(repuestos);
}