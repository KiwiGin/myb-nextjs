// app/api/hello/route.ts
import { insertarProyecto, obtenerProyectos } from '@/backend/dataBaseUtils/proyectoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Proyecto } from '@/models/proyecto';

export async function POST(req: NextRequest) {
    const proyecto: Proyecto = await req.json();
    await insertarProyecto(proyecto);
    return NextResponse.json({ message: 'Proyecto insertado exitosamente' });
}

export async function GET(req: NextRequest) {
    const repuestos = await obtenerProyectos();
    return NextResponse.json(repuestos);
}