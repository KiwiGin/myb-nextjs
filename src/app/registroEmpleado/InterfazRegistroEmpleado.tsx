"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { ImageLoader } from "@/components/ImageComponents/ImageLoader";
import { useRouter } from "next/navigation";

// Definir el esquema de validación con zod
const empleadoSchema = z.object({
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellido: z.string().min(1, { message: "El apellido es requerido" }),
  correo: z.string().email({ message: "Correo electrónico inválido" }),
  telefono: z.string().min(9, { message: "El teléfono es requerido" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  tipoDocumento: z
    .string()
    .min(1, { message: "El tipo de documento es requerido" }),
  documentoIdentidad: z
    .string()
    .min(1, { message: "El documento de identidad es requerido" }),
  imgBase64: z.preprocess(
    (val) => (typeof val !== "string" ? "" : val),
    z.string().min(1, { message: "La imagen es requerida" })
  ),
  rol: z.enum(["logistica", "tecnico", "supervisor", "jefe", "admin"], {
    errorMap: () => ({ message: "El rol es inválido" }),
  }),
});

// Tipos derivados del esquema
type EmpleadoFormData = z.infer<typeof empleadoSchema>;

export function InterfazRegistroEmpleado() {
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const router = useRouter();
  // Configuración de react-hook-form con zod
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema),
  });

  const handleImageUpload = (base64: string | null) => {
    if (!base64) return;
    setValue("imgBase64", base64 ? base64 : "");
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: EmpleadoFormData) => {
    setNoice({
      type: "loading",
      message: "Registrando empleado...",
      styleType: "modal",
    });

    try {
      // Encriptar la contraseña antes de enviar los datos
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const payload = { ...data, password: hashedPassword };

      const response = await fetch("/api/empleado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new MyBError("Error al registrar el empleado");
      reset();
      setNoice({
        type: "success",
        message: "Empleado registrado con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          router.replace("/");
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({ type: "error", message: "Error al registrar el empleado" });
      console.error(error);
    }
  };

  const hashP = async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    console.log(hashedPassword);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {noice && <Noice noice={noice} />}
      <h2 className="text-lg font-semibold mb-4">Registro de Empleado</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Nombre completo"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            type="text"
            placeholder="Apellido"
            {...register("apellido")}
          />
          {errors.apellido && (
            <p className="text-red-500">{errors.apellido.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="correo">Correo</Label>
          <Input
            id="correo"
            type="email"
            placeholder="Correo electrónico"
            {...register("correo")}
          />
          {errors.correo && (
            <p className="text-red-500">{errors.correo.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="Número de teléfono"
            {...register("telefono")}
          />
          {errors.telefono && (
            <p className="text-red-500">{errors.telefono.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            type="text"
            placeholder="Dirección"
            {...register("direccion")}
          />
          {errors.direccion && (
            <p className="text-red-500">{errors.direccion.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
          <Input
            id="tipoDocumento"
            type="text"
            placeholder="Tipo de documento"
            {...register("tipoDocumento")}
          />
          {errors.tipoDocumento && (
            <p className="text-red-500">{errors.tipoDocumento.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
          <Input
            id="documentoIdentidad"
            type="text"
            placeholder="Documento de identidad"
            {...register("documentoIdentidad")}
          />
          {errors.documentoIdentidad && (
            <p className="text-red-500">{errors.documentoIdentidad.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="rol">Rol</Label>
          <select
            id="rol"
            {...register("rol")}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Selecciona un rol</option>
            <option value="logistica">Logística</option>
            <option value="tecnico">Técnico</option>
            <option value="supervisor">Supervisor</option>
            <option value="jefe">Jefe</option>
            <option value="admin">Admin</option>
          </select>
          {errors.rol && <p className="text-red-500">{errors.rol.message}</p>}
        </div>

        <div className="mb-4">
          <Label>Foto del Empleado</Label>
          <ImageLoader
            setBase64={(base64: string | null) => handleImageUpload(base64)}
          />
          {errors.imgBase64 && (
            <p className="text-red-500">{errors.imgBase64.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Empleado
        </Button>

      </form>
      <Button onClick={hashP} className="w-full mt-4">
        Hash P
      </Button>
    </div>
  );
}
