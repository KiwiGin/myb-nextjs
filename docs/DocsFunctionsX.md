# Parámetros y retornos de los procedimientos almacenados

> [!NOTE]
> "formato compatible" indica si hay cambios con la estructura de los datos tanto entrada como salida, sin embargo todo
> se ha pasado a json por lo que hay que trabajarlo

## paxRegistrarCliente

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``json cliente`` as

````json
{
  "nombre": string,
  "ruc": string,
  "direccion": string,
  "telefono": string,
  "correo": string,
  "documento_de_identidad": string,
  "tipo_de_documento_de_identidad": string
}
````

_**Retorna**_

```int id_cliente```

## paxRegistrarEmpleado

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``json empleado`` as

````json
{
  "usuario": string,
  "password": string,
  "nombre": string,
  "apellido": string,
  "correo": string,
  "telefono": string,
  "direccion": string,
  "tipo_documento": string,
  "documento_identidad": string,
  "rol": string
}
````

_**Retorna**_

```int id_empleado```

## paxObtenerClientes

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``Nada``

_**Retorna**_

```json clientes``` as

````json
[
  {
    "idCliente": int,
    "nombre": string,
    "ruc": string,
    "direccion": string,
    "telefono": string,
    "correo": string,
    "documentoDeIdentidad": string,
    "tipoDeDocumentoDeIdentidad": string
  }
]
````

## paxObtenerPruebasConParametros

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``no``

_**Recibe**_

``nada``

_**Retorna**_

```json pruebas``` as

````json
[
  {
    "idTipoPrueba": int,
    "nombre": string,
    "parametros": [
      {
        "idParametro": int,
        "unidades": string,
        "nombre": string
      }
    ]
  }
]
````

## paxInsertarProyecto

_**Estado**_

- Aplicado testing: ``no (back pls)``
- Formato compatible: ``no``

_**Recibe**_

``json proyecto`` as

````json
{
  "titulo": string,
  "descripcion": string,
  "fechaInicio": string,
  "fechaFin": string,
  "idCliente": int,
  "idSupervisor": int,
  "idJefe": int,
  "costoManoDeObra": float,
  "repuestos": [
    {
      "idRepuesto": int,
      "cantidad": int
    }
  ],
  "parametros": [
    {
      "idParametro": int,
      "valorMaximo": float,
      "valorMinimo": float
    }
  ]
}
````

_**Retorna**_

```int id_proyecto```

## paxRegistrarRepuesto

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``json repuesto`` as

````json
{
  "nombre": string,
  "descripcion": string,
  "precio": float,
  "linkImg": string,
  "stockActual": int
}
````

_**Retorna**_

```int id_repuesto```

## paxObtenerRepuestos

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``Nada``

_**Retorna**_

```json repuestos``` as

````json
[
  {
    "idRepuesto": int,
    "nombre": string,
    "descripcion": string,
    "precio": float,
    "linkImg": string,
    "stockActual": int,
    "stockRequerido": int,
    "stockAsignado": int,
    "stockDisponible": int
  }
]
````

## paxObtenerProyectos

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``no``

_**Recibe**_

``Nada``

_**Retorna**_

```json proyectos``` as

````json5
[
  // paObtenerProyectoPorId
]
````

## paObtenerProyectoPorId ``[no_override]``

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``int id_proyecto``

_**Retorna**_

```json proyecto``` as

````json5
{
  // formato pendiente
}
````

## paCrearTipoPrueba ``[no_override]``

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``string nombre``

_**Retorna**_

```int id_tipo_prueba```

## paxCrearParametro

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``sí``

_**Recibe**_

``json parametro`` as

````json
{
  "idTipoPrueba": int,
  "nombre": string,
  "unidades": string
}
````

_**Retorna**_

```int id_parametro```

## paxCrearPruebaParametros

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``no``

_**Recibe**_

``json prueba`` as

````json5
{
  //nombre de la prueba
  "nombre": string,
  "parametros": [
    {
      "nombre": string,
      "unidades": string,
    }
  ]
}
````

_**Retorna**_

```int id_tipo_prueba```

## paxObtenerEmpleadosPorRol

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``string rol``

_**Retorna**_

```json empleados``` as

````json
[
  {
    "idEmpleado": int,
    "usuario": string,
    "nombre": string,
    "apellido": string,
    "correo": string,
    "telefono": string,
    "direccion": string,
    "tipoDocumento": string,
    "documentoIdentidad": string,
    "rol": string
  }
]
````

## paxObtenerRepuestosRequeridos

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``Nada``

_**Retorna**_

```json repuestos```

````json
[
  {
    "idRepuesto": int,
    "nombre": string,
    "descripcion": string,
    "precio": float,
    "linkImg": string,
    "stockRequerido": int,
    "stockAsignado": int,
    "stockDisponible": int
  }
]
````

## paxActualizarStock

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``json repuesto`` as

````json
{
  "idRepuesto": int,
  "stockAgregado": int
}
````

_**Retorna**_

``int id_repuesto``

## paxObtenerClientesPorIds

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``json ids`` as

````json
[
  int
]
````

_**Retorna**_

```json clientes``` as

````json
[
  {
    "idCliente": int,
    "nombre": string,
    "ruc": string,
    "direccion": string,
    "telefono": string,
    "correo": string,
    "documentoDeIdentidad": string,
    "tipoDeDocumentoDeIdentidad": string
  }
]
````

## paxObtenerEmpleadosPorIds

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``json ids`` as

````json
[
  int
]
````

_**Retorna**_

```json empleados``` as

````json
[
  {
    "idEmpleado": int,
    "usuario": string,
    "nombre": string,
    "apellido": string,
    "correo": string,
    "telefono": string,
    "direccion": string,
    "tipoDocumento": string,
    "documentoIdentidad": string,
    "rol": string
  }
]
````

## paxObtenerRepuestosPorIds

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``json ids`` as

````json
[
  int
]
````

_**Retorna**_

```json repuestos``` as

````json
[
  {
    "idRepuesto": int,
    "nombre": string,
    "descripcion": string,
    "precio": float,
    "linkImg": string,
    "stockRequerido": int,
    "stockAsignado": int,
    "stockDisponible": int
  }
]
````

## paxObtenerRepuestosPorProyecto

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``int id_proyecto``

_**Retorna**_

```json repuestos```

````json
[
  {
    "idRepuesto": int,
    "nombre": string,
    "descripcion": string,
    "precio": float,
    "linkImg": string,
    "stockRequerido": int,
    "stockAsignado": int,
    "stockDisponible": int,
    "cantidad": int
  }
]
````

## paxAgregarRepuestosRequeridos

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``json repuestos`` as

````json5
[
  {
    "idRepuesto": int,
    // cantidad a agregar (positivo)
    "stockRequerido": int
  }
]
````

_**Retorna**_

``Nada``

## paxAsignarRepuestosAProyecto

_**Estado**_

- Aplicado testing: ``no (back pls)``
- Formato compatible: ``si``

_**Recibe**_

``json repuestos`` as

````json5
[
  {
    "idRepuesto": int,
    // cantidad a asignar (positivo)
    "stockAsignado": int
  }
]
````
_**Retorna**_

``Nada``

## paxObtenerProyectoPorJefe

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``int id_jefe``

_**Retorna**_

```json proyectos```

````json5
[
  // paObtenerProyectoPorId
]
````

## paxObtenerEtapaPorId

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``si``

_**Recibe**_

``int id_etapa``


_**Retorna**_

```json etapa```

````json5
{
  "idEtapa": int,
  "nombre": string,
}
````

## paxObtenerRepuestosFaltantesPorJefe

_**Estado**_

- Aplicado testing: ``si``
- Formato compatible: ``no``

_**Recibe**_

``int id_jefe``

_**Retorna**_

```json repuestos```

````json
[
  {
    "idRepuesto": int,
    "nombre": string,
    "descripcion": string,
    "precio": float,
    "linkImg": string,
    "stockRequerido": int,
    "stockAsignado": int,
    "stockDisponible": int,
    "cantidad": int,
  }
]
````