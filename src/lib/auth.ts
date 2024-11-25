import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import MyBError from "@/lib/mybError";

import { USUARIOS } from "@/models/MOCKUPS";

const getUserByUsername = async (username: string) => {
  return USUARIOS.find((user) => user.username === username);
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const user = await getUserByUsername(username);

        if (!user) {
          throw new MyBError("user_not_found");
        }

        /* const matchPassword = await comparePass(password, user.password);

        if (!matchPassword) {
          throw new Error("Password does not match");
        }
 */
        return {
          id: user.idUsuario,
          username: user.username,
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
          username: string;
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
    "/registroRepuesto",
    "/registroProyecto",
    "/registroPrueba",
  ],
  supervisor: ["/proyectos"],
  tecnico: ["/seguimientoTareas"],
  logistica: ["/visualizacionRepuestos"],
};
