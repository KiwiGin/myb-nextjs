// app/api/repuesto/route.ts
import { actualizarStockRepuesto, obtenerRepuestos, registrarRepuesto } from '@/backend/dataBaseUtils/repuestoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Repuesto } from '@/models/repuesto';
import { base64ToBlob, uploadImage } from '@/backend/firebaseUtils/firebaseStorage';

export async function POST(req: NextRequest) {
    const repuesto: Repuesto = await req.json();
    // recibe el repuesto con la imagen como un base64
    const base64String = repuesto.img_base64;
    if (!base64String) {
        console.error("La imagen en formato base64 no está disponible.");
        return NextResponse.json({ message: 'Error al insertar repuesto' });
      }
    const contentType = 'image/png';
    const blob = base64ToBlob(base64String, contentType);

    // Aqui se hace la subida a firebase y se obtiene el url
    const result = await uploadImage(blob);
    // Debe enviar el repuesto con la imagen como un url
    repuesto.link_img = result?.downloadURL || '';
    // console.log(repuesto);
    await registrarRepuesto(repuesto);
    return NextResponse.json({ message: 'Repuesto insertado exitosamente' });
}

export async function GET() {
    const repuestos: Repuesto[] = await obtenerRepuestos();
    return NextResponse.json(repuestos);
}

//put
export async function PUT(req: NextRequest) {
    const repuesto: Repuesto = await req.json();
    await actualizarStockRepuesto(repuesto);
    return NextResponse.json({ message: 'Repuesto actualizado exitosamente' });
}