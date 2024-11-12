// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { empleados } from "../../../lib/db";
import { Empleado } from "@/models/empleado";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = empleados.find(
          (emp) => emp.usuario === credentials.usuario
        );

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return user as unknown as User; // Forzar el tipo a `User`
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = empleados.find((emp) => emp.idEmpleado.toString() === token.sub);
      if (user) {
        session.user = user;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.idEmpleado.toString();
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
