"use client";
import { Noice } from "@/components/Noice";
import { Button } from "@/components/ui/button";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  correo: z.string().email({ message: "Debe ser un correo válido" }).min(1, { message: "El correo es requerido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).min(1, { message: "La contraseña es requerida" }),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Page() {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const { correo, password } = data;
  
      // Intentar iniciar sesión con credenciales
      signIn("credentials", {
        correo,
        password,
        redirect: true,
      });

    } catch (error) {
      if (error instanceof MyBError) {
        setNoice({
          type: "error",
          message: error.message,
        });
      } else {
        setNoice({
          type: "error",
          message: "Ocurrió un error inesperado. Intenta de nuevo.",
        });
      }
    }
  };

  return (
    <div className="w-full h-lvh flex flex-1 items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {noice && <Noice noice={noice} />}
          <div className="w-full md:w-1/2 flex flex-col items-center gap-y-4 mx-auto p-10">
            <h1 className="flex flex-row h-20 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-zinc-700 from-slate-900 mr-2">
                MyB
              </span>
              Hidraulic
            </h1>

            <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
            <FormField
              name="correo"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/2 md:w-2/3">
                  <FormLabel>Correo</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/2 md:w-2/3">
                  <FormLabel>Contraseña</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-1/2 md:w-2/3 mt-4">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
