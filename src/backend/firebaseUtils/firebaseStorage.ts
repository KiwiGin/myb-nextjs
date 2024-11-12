import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {storage} from './firebaseConfig';
import { v4 as uuidv4 } from "uuid";

export function base64ToBlob(base64: string, contentType = ''): Blob {
    // Eliminar el prefijo 'data:image/png;base64,' si existe
    const cleanedBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, "");
  
    const byteCharacters = atob(cleanedBase64); // Convertir el base64 a caracteres binarios
    const byteArrays = [];
  
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    return new Blob(byteArrays, { type: contentType });
  }

// Sube un archivo a Firebase Storage
export async function uploadImage(blob: Blob | null): Promise<{ downloadURL: string | null } | null> {
    if (!blob) return null;
  
    try {
      const storageRef = ref(storage, `myb/${uuidv4()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      return {
        downloadURL
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }