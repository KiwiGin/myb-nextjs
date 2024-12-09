import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import MyBError from "@/lib/mybError";

import { USUARIOS } from "@/models/MOCKUPS";

const getUserByCorreo = async (correo: string) => {
  return USUARIOS.find((user) => user.correo === correo);
};

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

        const user = await getUserByCorreo(correo);

        if (!user) {
          throw new MyBError("user_not_found");
        }

        /* const matchPassword = await comparePass(password, user.password);

        if (!matchPassword) {
          throw new Error("Password does not match");
        }
 */
        return {
          id: user.idEmpleado,
          correo: user.correo,
          created_at: new Date().toISOString(),
          rol: user.rol as "admin" | "jefe" | "supervisor" | "tecnico",
        };
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
          rol: "admin" | "jefe" | "supervisor" | "tecnico";
        };
      }
      return Promise.resolve(token); // JWT interface we declared in next-auth.d.ts
    },
    async session({ session, token }) {
      session.user = token.user;
      return session; // Session interface we declared in next-auth.d.ts
    },
    redirect({}) {
      return "/"; // Redirect to home page
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
    "/registroEmpleado",
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
