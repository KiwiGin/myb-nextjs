import {
  paObtenerEmpleados,
  registrarEmpleado,
} from "@/backend/dataBaseUtils/empleadoDA";
import { NextRequest, NextResponse } from "next/server";
import { Empleado } from "@/models/empleado";
import {
  base64ToBlob,
  uploadImage,
} from "@/backend/firebaseUtils/firebaseStorage";

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<Empleado[]>> {
  const empleados: Empleado[] = await paObtenerEmpleados();
  return NextResponse.json(empleados);
}

export async function POST(req: NextRequest) {
  try {
    // Leer los datos del cuerpo de la solicitud
    const jsonData: Empleado = await req.json();
    console.log("Datos recibidos para registrar empleado:", jsonData);

    // recibe el empleado con la imagen como un base64
    const base64String = jsonData.imgBase64;
    if (!base64String) {
      console.error("La imagen en formato base64 no está disponible.");
      return NextResponse.json({ message: "Error al insertar repuesto" });
    }
    const contentType = "image/png";
    const blob = base64ToBlob(base64String, contentType);

    // Aqui se hace la subida a firebase y se obtiene el url
    const result = await uploadImage(blob);
    // Debe enviar el repuesto con la imagen como un url
    jsonData.linkImg = result?.downloadURL || "";
    // console.log(repuesto);

    // Llamar a la función para registrar empleado
    const idEmpleado = await registrarEmpleado(jsonData);

    // Responder con el ID del empleado registrado
    return NextResponse.json({
      message: "Empleado registrado exitosamente",
      idEmpleado,
    });
  } catch (err) {
    console.error("Error en el endpoint al registrar empleado:", err);
    return NextResponse.json(
      { message: "Error al registrar empleado", error: err },
      { status: 500 }
    );
  }
}
