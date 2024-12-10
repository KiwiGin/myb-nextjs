import { NextResponse } from "next/server";
import { paValidarLogin } from "@/backend/dataBaseUtils/authDA";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { correo, password } = await req.json();

    if (!correo || !password) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    const response = await paValidarLogin(correo, password);

    if (response.response === "invalid_credentials") {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (response.response === "db_error") {
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    const { empleado } = response;

    // Validar la contraseña usando bcrypt
    const passwordMatch = await bcrypt.compare(password, empleado!.password!);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Excluir la contraseña antes de devolver al cliente
    const { password: _, ...empleadoSinPassword } = empleado!;

    return NextResponse.json({ empleado: empleadoSinPassword }, { status: 200 });
  } catch (err) {
    console.error("Error in login API:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
