"use client";
import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone-esm";
import { PinTopIcon } from "@radix-ui/react-icons";

const ERRORS = {
  invalid_file_type: "Archivo no permitido",
  too_many_files: "Solo es posible subir 1 archivo a la vez",
  file_too_large: "Tamaño máximo de archivo: 100MB",
  file_not_found: "No se ha encontrado el archivo",
  upload_failed: "Subida de imagen fallida",
};

const typesAccepted = ["jpg", "jpeg", "png"];

export function ImageLoader({
  setBase64,
}: {
  setBase64: (base64: string | null) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const validateFiles = (file: File) => {
    if (file === undefined || file.name === undefined)
      return {
        code: "no-file-found",
        message: ERRORS.file_not_found,
      };

    const ext = file.name.split(".").pop() || "";

    if (!typesAccepted.includes(ext))
      return {
        code: "type-incorrect",
        message: ERRORS.invalid_file_type,
      };

    if (file.size > 1024 * 1024 * 100) {
      console.log("file too large");
      return {
        code: "file-too-large",
        message: ERRORS.file_too_large,
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDropAccepted: (aceeptedFiles) => {
      setFileName(aceeptedFiles[0].name);
      handleImageChange(aceeptedFiles);
    },
    validator: validateFiles,
    maxFiles: 1,
  });

  const errorsMessage = useMemo(() => {
    if (fileRejections[0]) {
      const { errors } = fileRejections[0];
      if (errors[0].code === "file-too-large") {
        return ERRORS.file_too_large;
      } else if (errors[0].code === "type-incorrect") {
        return ERRORS.invalid_file_type;
      } else if (errors[0].code === "too-many-files") {
        return ERRORS.too_many_files;
      } else {
        return ERRORS.upload_failed;
      }
    }
    return undefined;
  }, [fileRejections]);

  async function handleImageChange(files: File[]) {
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const reader = new FileReader();
        console.log("file", file);
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (reader.result && typeof reader.result === "string") {
            setBase64(reader.result);
            const img = new Image();
            img.src = reader.result;
            // img.onload = () => {
            //     setImageMetadata({
            //         width: img.width,
            //         height: img.height,
            //     });
            // };
          }
        };
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
      }
    } else {
      setBase64(null);
      // setImageMetadata(null);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-gradient-to-r to-slate-700 from-slate-800 p-3 rounded-lg w-full">
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center pt-5 pb-6 w-full px-4 h-28 border-2 border-white border-dashed rounded-lg cursor-pointer bg-gray-300 bg-opacity-25 border-opacity-25 text-opacity-100 hover:bg-opacity-25 hover:bg-bray-800 hover:bg-gray-600 hover:border-white"
        >
          <PinTopIcon
            className={`h-8 w-8 ${
              errorsMessage ? "text-red-600" : "text-white"
            }`}
          />
          {errorsMessage ? (
            <p className="text-red-500">{errorsMessage}</p>
          ) : fileName ? (
            <span className="font-semibold text-sm mt-2 text-white">{fileName}</span>
          ) : (
            <p
              className={`text-sm ${
                errorsMessage ? "text-red-600" : "text-white"
              } text-center`}
            >
              <span className="font-semibold text-sm mt-2">
                Click para seleccionar un archivo
              </span>{" "}
              o arrastralo aquí
            </p>
          )}
          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  );
}
