// app/api/parametro/route.ts
import { registrarParametro } from '@/backend/dataBaseUtils/pruebaParametroDA';
import { NextRequest, NextResponse } from 'next/server';
import { Parametro } from '@/models/parametro';

export async function POST(req: NextRequest) {
    const parametro: Parametro = await req.json();
    await registrarParametro(parametro);
    return NextResponse.json({ message: 'Parametro insertado exitosamente' });
}
