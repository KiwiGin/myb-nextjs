import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}
