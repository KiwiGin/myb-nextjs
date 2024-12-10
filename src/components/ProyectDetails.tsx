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
        <CardTitle className="text-6xl font-bold text-gray-800">{proyecto.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <CardDescription className="text-lg text-gray-600">{proyecto.descripcion}</CardDescription>
        <p className="text-lg font-semibold text-gray-700">
          Costo Total: <span className="text-green-600">${proyecto.costoTotal?.toFixed(2) || 'No calculado'}</span>
        </p>

        {/* Cliente */}
        {proyecto.cliente && <ClienteInfo cliente={proyecto.cliente} />}

        {/* Jefe */}
        {proyecto.jefe && (
          <Card className="bg-white shadow-md rounded-md p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Jefe de Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div key={proyecto.jefe.idEmpleado} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow">
                <EmpleadoPictureCard empleado={proyecto.jefe} enableOnHoverInfo />
                <div className="flex-1">
                  <p className="text-lg font-medium">{`${proyecto.jefe.nombre} ${proyecto.jefe.apellido}`}</p>
                  <p className="text-sm text-gray-600">{proyecto.jefe.correo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supervisor */}
        {proyecto.supervisor && (
          <Card className="bg-white shadow-md rounded-md p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Supervisor de Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div key={proyecto.supervisor.idEmpleado} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow">
                <EmpleadoPictureCard empleado={proyecto.supervisor} enableOnHoverInfo />
                <div className="flex-1">
                  <p className="text-lg font-medium">{`${proyecto.supervisor.nombre} ${proyecto.supervisor.apellido}`}</p>
                  <p className="text-sm text-gray-600">{proyecto.supervisor.correo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
    <Card className="bg-white shadow-md rounded-md p-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 mb-4">Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-gray-700">Nombre:</p>
            <p className="text-sm text-gray-800">{cliente.nombre}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">RUC:</p>
            <p className="text-sm text-gray-800">{cliente.ruc}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Dirección:</p>
            <p className="text-sm text-gray-800">{cliente.direccion}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Teléfono:</p>
            <p className="text-sm text-gray-800">{cliente.telefono}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-semibold text-gray-700">Correo:</p>
            <p className="text-sm text-gray-800">{cliente.correo}</p>
          </div>
        </div>
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
        <CardTitle className="text-lg font-semibold text-gray-800">Técnicos Actuales</CardTitle>
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
                <p className="font-semibold">{repuesto.nombre}: {repuesto.cantidad}</p>
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
        {especificaciones.map((especificacion) => (
          <div key={especificacion.idTipoPrueba} className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">{especificacion.nombre}</h3>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Parámetro</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Unidad</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Rango</th>
                </tr>
              </thead>
              <tbody>
                {especificacion.parametros.map((parametro) => (
                  <tr key={parametro.idParametro}>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{parametro.nombre}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{parametro.unidades}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {parametro.valorMinimo} a {parametro.valorMaximo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
