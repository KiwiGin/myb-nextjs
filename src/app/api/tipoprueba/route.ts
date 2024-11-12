// app/api/tipoPrueba/route.ts
import { registrarTipoPrueba } from '@/backend/dataBaseUtils/pruebaParametroDA';
import { NextRequest, NextResponse } from 'next/server';
import { TipoPrueba } from '@/models/tipoprueba';

export async function POST(req: NextRequest) {
    const tipoPrueba: TipoPrueba = await req.json();
    await registrarTipoPrueba(tipoPrueba);
    return NextResponse.json({ message: 'Tipo de Prueba insertado exitosamente' });
}
