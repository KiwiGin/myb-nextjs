export declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      id: number;
      created_at: string | null;
      rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
    };
  }
  interface User {
    username: string;
    id: number;
    created_at: string | null;
    rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
  }
}

export declare module "next-auth/jwt" {
  interface JWT {
    user: {
      username: string;
      id: number;
      created_at: string | null;
      rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
    };
  }
}
