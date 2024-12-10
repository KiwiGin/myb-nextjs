import React, { useState } from 'react';
import { Proyecto } from '@/models/proyecto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Repuesto } from '@/models/repuesto';
import { Empleado } from '@/models/empleado';
import { Cliente } from '@/models/cliente';
import Image from 'next/image';
import { EspecificacionPrueba } from '@/models/especificacion';
import { Button } from './ui/button';
import { ResultadosModal } from './ResultadosModal';
import { EmpleadoPictureCard } from './EmpleadoPictureCard';

interface ProyectoDetalleProps {
  proyecto: Proyecto;
}

const ProyectoDetalle: React.FC<ProyectoDetalleProps> = ({ proyecto }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="bg-gray-50 shadow-lg rounded-lg">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">{proyecto.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <CardDescription className="text-gray-600">{proyecto.descripcion}</CardDescription>
        <p className="text-lg font-semibold text-gray-700">
          Costo Total: <span className="text-green-600">${proyecto.costoTotal?.toFixed(2) || 'No calculado'}</span>
        </p>

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

        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full bg-black text-white hover:bg-gray-600 transition-colors duration-200"
        >
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
    <Card className="bg-white shadow-md rounded-md p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Cliente</CardTitle>
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
    <Card className="bg-white shadow-md rounded-md p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Empleados Actuales</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {empleados.map((empleado) => (
            <li key={empleado.idEmpleado} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow">
              <EmpleadoPictureCard empleado={empleado} enableOnHoverInfo />
              <div className="flex-1">
                <p className="text-lg font-medium">{`${empleado.nombre} ${empleado.apellido}`}</p>
                <p className="text-sm text-gray-600">{empleado.correo}</p>
              </div>
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
    <Card className="bg-white shadow-md rounded-md p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Repuestos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {repuestos.map((repuesto) => (
            <li key={repuesto.idRepuesto} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow">
              {repuesto.linkImg && (
                <Image
                  src={repuesto.linkImg}
                  alt={`Imagen de ${repuesto.nombre}`}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              )}
              <div>
                <p className="font-semibold">{repuesto.nombre}</p>
                <p className="text-gray-600">Precio: ${repuesto.precio.toFixed(2)}</p>
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
    <Card className="bg-white shadow-md rounded-md p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Especificaciones de Pruebas</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {especificaciones.map((especificacion) => (
            <li key={especificacion.idTipoPrueba}>
              <h3 className="font-semibold">{especificacion.nombre}</h3>
              <ul className="mt-2 space-y-2">
                {especificacion.parametros.map((parametro) => (
                  <li key={parametro.idParametro}>
                    <p className="text-sm">Parámetro: {parametro.nombre}</p>
                    <p className="text-sm">Unidad: {parametro.unidades}</p>
                    <p className="text-sm">
                      Rango: {parametro.valorMinimo} a {parametro.valorMaximo}
                    </p>
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
