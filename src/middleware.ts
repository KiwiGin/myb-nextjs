import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { authorizedRoutes } from "@/lib/auth";

export default withAuth(function middleware(req) {
  if (!req.nextauth.token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.rewrite(url);
  }

  const rol = req.nextauth.token.user.rol;
  const path = req.nextUrl.pathname;
  const isAuthorized =
    path === "/" ||
    authorizedRoutes[`${rol}`].find((route) => path.startsWith(route));

  if (!isAuthorized) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
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
