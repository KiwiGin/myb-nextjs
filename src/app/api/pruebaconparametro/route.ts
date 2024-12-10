// app/api/pruebaconparametro/route.ts
import { obtenerPruebaConParametros } from '@/backend/dataBaseUtils/pruebaParametroDA';
import { registrarTipoPrueba, registrarParametro } from '@/backend/dataBaseUtils/pruebaParametroDA';
import { TipoPrueba } from '@/models/tipoprueba';
import { Parametro } from '@/models/parametro';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const repuestos = await obtenerPruebaConParametros();
    return NextResponse.json(repuestos);
}

export async function POST(req: NextRequest) {
    try {
        // Leer los datos del cuerpo de la solicitud
        const { nombreTipoPrueba, parametros }: { nombreTipoPrueba: string; parametros: Parametro[] } = await req.json();

        // Crear el tipo de prueba y obtener el idTipoPrueba generado
        const tipoPrueba: TipoPrueba = { nombre: nombreTipoPrueba };
        const { idTipoPrueba } = await registrarTipoPrueba(tipoPrueba);

        // Registrar cada parámetro usando el idTipoPrueba
        for (const parametro of parametros) {
            await registrarParametro({ ...parametro, idTipoPrueba });
        }

        // Responder con un mensaje de éxito
        return NextResponse.json({ message: 'Tipo de prueba y parámetros registrados exitosamente' });
    } catch (err) {
        console.error('Error al registrar tipo de prueba y parámetros:', err);
        return NextResponse.json({ error: 'Error al registrar tipo de prueba y parámetros' }, { status: 500 });
    }
}