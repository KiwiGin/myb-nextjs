import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

const auth = NextAuth(authOptions);

export { auth as GET, auth as POST };
