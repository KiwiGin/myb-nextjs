import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import MyBError from "@/lib/mybError";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        correo: {},
        password: {},
      },
      async authorize(credentials) {
        const { correo, password } = credentials as {
          correo: string;
          password: string;
        };

        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password }),
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            throw new MyBError(errorResponse.message || "auth_error");
          }

          const { empleado } = await response.json();

          console.log("empleado", empleado);

          return {
            id: empleado.idEmpleado!,
            correo: empleado.correo!,
            created_at: new Date().toISOString(),
            rol: empleado.rol! as "admin" | "jefe" | "supervisor" | "tecnico" | "logistica",
            nombre: empleado.nombre!,
            apellido: empleado.apellido!,
            telefono: empleado.telefono!,
            direccion: empleado.direccion!,
            linkImg: empleado.linkImg!,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as {
          id: number;
          correo: string;
          created_at: string | null;
          rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
          nombre: string;
          apellido: string;
          telefono: string;
          direccion: string;
          linkImg: string | null;
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    redirect() {
      return "/";
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export const authorizedRoutes = {
  admin: [
    "/registroEmpleado",
    "/proyeccionRepuestos",
    "/proyectos",
    "/registroCliente",
    "/registroRepuesto",
    "/registroProyecto",
    "/registroPrueba",
    "/seguimientoTareas",
    "/visualizacionRepuestos",
  ],
  jefe: [
    "/proyeccionRepuestos",
    "/proyectos",
    "/registroCliente",
    "/registroEmpleado",
    "/registroRepuesto",
    "/registroProyecto",
    "/registroPrueba",
  ],
  supervisor: ["/proyectos"],
  tecnico: ["/seguimientoTareas"],
  logistica: ["/visualizacionRepuestos"],
};
