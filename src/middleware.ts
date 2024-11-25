import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(req) {
  if (!req.nextauth.token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/proyeccionRepuestos/:path*",
    "/proyectos/:path*",
    "/registroCliente/:path*",
    "/registroRepuesto/:path*",
    "/registroProyecto/:path*",
    "/registroPrueba/:path*",
    "/seguimientoTareas/:path*",
    "/visualizacionRepuestos/:path*",
  ],
};
