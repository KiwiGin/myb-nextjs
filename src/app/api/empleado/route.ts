import { paObtenerEmpleados, registrarEmpleado } from '@/backend/dataBaseUtils/empleadoDA';
import { NextRequest, NextResponse } from 'next/server';
import { Empleado } from '@/models/empleado';

export async function GET(): Promise<NextResponse<Empleado[]>> {
    const empleados: Empleado[] = await paObtenerEmpleados();
    return NextResponse.json(empleados);
}

export async function POST(req: NextRequest) {
    try {
      // Leer los datos del cuerpo de la solicitud
      const jsonData: Empleado = await req.json();
  
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