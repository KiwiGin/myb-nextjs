import { NextRequest, NextResponse } from 'next/server';
import { agregarRepuestosSolicitados} from '@/backend/dataBaseUtils/repuestoDA';

export async function POST(req: NextRequest) {
    const repuestos: { idRepuesto: number, cantidadSolicitada: number }[] = await req.json();
    console.log("repuestos")
    console.log(repuestos)
    await agregarRepuestosSolicitados(repuestos);
    return NextResponse.json({ message: 'Repuestos solicitados agregados exitosamente' });
}