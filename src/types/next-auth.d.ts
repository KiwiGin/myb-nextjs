export declare module "next-auth" {
  interface Session {
    user: {
      correo: string;
      id: number;
      created_at: string | null;
      rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
    };
  }
  interface User {
    correo: string;
    id: number;
    created_at: string | null;
    rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
  }
}

export declare module "next-auth/jwt" {
  interface JWT {
    user: {
      correo: string;
      id: number;
      created_at: string | null;
      rol: "admin" | "jefe" | "supervisor" | "tecnico" | "logistica";
    };
  }
}
