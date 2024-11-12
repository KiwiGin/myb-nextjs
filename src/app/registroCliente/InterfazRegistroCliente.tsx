import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InterfazRegistroCliente() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registro de Cliente</h2>
      
      <form>
        <div className="mb-4">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" type="text" placeholder="Nombre completo" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="ruc">RUC</Label>
          <Input id="ruc" type="text" placeholder="Número de RUC" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" type="text" placeholder="Dirección" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" type="tel" placeholder="Número de teléfono" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="correo">Correo</Label>
          <Input id="correo" type="email" placeholder="Correo electrónico" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="documentoDeIdentidad">Documento de Identidad</Label>
          <Input id="documentoDeIdentidad" type="text" placeholder="Documento de identidad" />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="tipoDeDocumento">Tipo de Documento</Label>
          <Input id="tipoDeDocumento" type="text" placeholder="Tipo de documento" />
        </div>
        
        <Button type="submit" className="w-full mt-4">
          Registrar Cliente
        </Button>
      </form>
    </div>
  );
}
