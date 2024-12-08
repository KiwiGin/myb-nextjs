import React, { useState } from 'react';
import { Proyecto } from '@/models/proyecto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Repuesto } from '@/models/repuesto';
import { Empleado } from '@/models/empleado';
import { Cliente } from '@/models/cliente';
import Image from 'next/image';
import { EspecificacionPrueba } from '@/models/especificacion';
import { Button } from './ui/button';
import { ResultadosModal } from './ResultadosModal';


interface ProyectoDetalleProps {
  proyecto: Proyecto;
}

const ProyectoDetalle: React.FC<ProyectoDetalleProps> = ({ proyecto } : ProyectoDetalleProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{proyecto.titulo}</CardTitle>
        <p>{proyecto.descripcion}</p>
      </CardHeader>
      <CardContent>
        <h2>Detalles del Proyecto</h2>
        <p>Costo Total: ${proyecto.costoTotal?.toFixed(2) || 'No calculado'}</p>
        
        {/* Cliente */}
        {proyecto.cliente && <ClienteInfo cliente={proyecto.cliente} />}
        
        {/* Empleados */}
        {proyecto.empleadosActuales && (
          <EmpleadosInfo empleados={proyecto.empleadosActuales} />
        )}

        {/* Repuestos */}
        {proyecto.repuestos && <RepuestosInfo repuestos={proyecto.repuestos} />}

        {/* Especificaciones */}
        {proyecto.especificaciones && (
          <EspecificacionesInfo especificaciones={proyecto.especificaciones} />
        )}

        <Button onClick={() => setDialogOpen(true)} className="mb-4">
          Ver Historial de Pruebas
        </Button>

        <ResultadosModal open={dialogOpen} onClose={() => setDialogOpen(false)} proyecto={proyecto} />
      </CardContent>
    </Card>
  );
};

export default ProyectoDetalle;

interface ClienteInfoProps {
  cliente: Cliente;
}

const ClienteInfo: React.FC<ClienteInfoProps> = ({ cliente }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Nombre: {cliente.nombre}</p>
        <p>RUC: {cliente.ruc}</p>
        <p>Dirección: {cliente.direccion}</p>
        <p>Teléfono: {cliente.telefono}</p>
        <p>Correo: {cliente.correo}</p>
      </CardContent>
    </Card>
  );
};

interface EmpleadosInfoProps {
  empleados: Empleado[];
}

const EmpleadosInfo: React.FC<EmpleadosInfoProps> = ({ empleados }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empleados Involucrados</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {empleados.map((empleado) => (
            <li key={empleado.idEmpleado}>
              {empleado.nombre} {empleado.apellido} - {empleado.rol || 'Sin rol'}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

interface RepuestosInfoProps {
  repuestos: Repuesto[];
}

const RepuestosInfo: React.FC<RepuestosInfoProps> = ({ repuestos }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repuestos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {repuestos.map((repuesto) => (
            <li key={repuesto.idRepuesto} className="flex items-center gap-4">
              {repuesto.linkImg && (
                <Image
                  src={repuesto.linkImg}
                  alt={`Imagen de ${repuesto.nombre}`}
                  width={50}
                  height={50}
                  className="rounded"
                />
              )}
              <div>
                <p>Nombre: {repuesto.nombre}</p>
                <p>Precio: ${repuesto.precio.toFixed(2)}</p>
                <p>{repuesto.descripcion}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};


interface EspecificacionesInfoProps {
  especificaciones: EspecificacionPrueba[];
}

const EspecificacionesInfo: React.FC<EspecificacionesInfoProps> = ({ especificaciones }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Especificaciones de Pruebas</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {especificaciones.map((especificacion) => (
            <li key={especificacion.idTipoPrueba} className="mb-4">
              <h3>{especificacion.nombre}</h3>
              <ul>
                {especificacion.parametros.map((parametro) => (
                  <li key={parametro.idParametro}>
                    <p>Parámetro: {parametro.nombre}</p>
                    <p>Unidad: {parametro.unidades}</p>
                    <p>Rango: {parametro.valorMinimo} - {parametro.valorMaximo}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};