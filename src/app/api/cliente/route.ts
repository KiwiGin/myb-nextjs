// app/api/cliente/route.ts
import { insertarCliente, obtenerClientes } from '@/backend/dataBaseUtils/clienteDA';
import { NextRequest, NextResponse } from 'next/server';
import { Cliente } from '@/models/cliente';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<Cliente[]>> {
    const clientes: Cliente[] = await obtenerClientes();
    return NextResponse.json(clientes);
}

export async function POST(req: NextRequest) {
    const cliente: Cliente = await req.json();
    await insertarCliente(cliente);
    return NextResponse.json({ message: 'Cliente insertado exitosamente' });
}