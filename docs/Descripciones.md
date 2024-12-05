SPRINT 2

# [ ] CUS-15 Registro de Repuestos

## Front

### Pide a la API
- Nada

### Envia a la API
- `POST` a `/repuestos`

```json
{
  "nombre": string,
  "precio": number,
  "descripcion": string,
  "imgBase64": string,
  "stockDisponible": number
}
```

## API

- Convierte el `imgBase64` a un `linkImg`

### Envia a la DB
- `paInsertarRepuesto`

```sql
CALL paInsertarRepuesto(
  nombre,
  precio,
  descripcion,
  linkImg,
  stockDisponible
);
```

# [ ] CUS-05 Registro de Proyecto
# [ ] CUS-06 Registro de Pruebas
# [ ] CUS-14 Registro de Clientes

SPRINT 3
# [ ] CUS-04 Proyección de Repuestos
# [ ] CUS-13 Visualización de Repuestos Requeridos
# [ ] CUS-01 Asignación de Repuestos
# [ ] CUS-07 Seguimiento de Proyecto

SPRINT 4
# [ ] CUS-02 Asignación de Tareas

## Front

### Pide a la API
- Pide los técnicos disponibles (`GET` a `/empleado/por-rol/tecnico/disponible`)

## API

### Pide a la DB
- `paObtenerTecnicosDisponibles`

```sql
CALL paObtenerTecnicosDisponibles();
```

```json
  empleados: Empleados[]
Empleado
{
  "idEmpleado": number,
  "usuario": string,
  "nombre": string,
  "apellido": string,
  "correo": string,
  "telefono": string,
  "direccion": string,
  "documentoIdentidad": string,
  "tipoDocumento": string,
  "rol": string,
}
```

## DB

### Responde a la API

```json
[
  {
    "idEmpleado": number,
    "usuario": string,
    "nombre": string,
    "apellido": string,
    "correo": string,
    "telefono": string,
    "direccion": string,
    "documentoIdentidad": string,
    "tipoDocumento": string,
    "rol": string,
  }
]
```

# Front

## Envia a la API

- `POST` a `/proyecto/asignar-empleados`

```json
{
  "idProyecto": number,
  "idEmpleados": number[],
  "fechaAsignacion": Date
}
```

## API

### Envia a la DB

- `paAsignarEmpleadosAProyecto(idProyecto, idEmpleados, fechaAsignacion)`

```sql
CALL paAsignarEmpleadosAProyecto(
  idProyecto,
  idEmpleados,
  fechaAsignacion
);
```

- Envia error si alguno de los empleados ya está asignado a otro proyecto
- Debe cambiar la etapa del proyecto usando `paCambiarEtapaProyecto(idProyecto, etapa, fecha)`

```sql
CALL paCambiarEtapaProyecto(
  idProyecto,
  etapa.
  fechaAsignacion
);
```

# [ ] CUS-08 Seguimiento de Tareas

### Front

#### Pide a la API
- Pide el proyecto en el que está trabajando el empleado (`GET` a `/proyecto/por-empleado/{idEmpleado}`)

### API

#### Pide a la DB
- `paObtenerProyectoPorEmpleado(idEmpleado)`

```sql
CALL paObtenerProyectoPorEmpleado(idEmpleado);
```

```json
{
  "idProyecto": number,
  "titulo": string,
  "descripcion": string,
  "fechaInicio": Date,
  "fechaFin": Date,
  "costoManoObra": number,
  "costoRepuestos": number,
  "costoTotal": number,

  "idCliente": number,
  "idSupervisor": number,
  "idJefe": number,
  "idEtapaActual": number,

  "cliente": Cliente,
  "supervisor": Empleado,
  "jefe": Empleado,
  "etapaActual": string,

  "repuestos": Repuesto[],
  "especificaciones": Especificacion[],
  "resultados": ResultadoPrueba[],
  "feedbacks": Feedback[],

  "empleadosActuales": Empleado[]
}
```

**Según el idEtapaActual del proyecto:**

## Escenario 1: Reparando

### Front

#### Envía a la API

- `POST` a `/proyecto/reparando`

```json
{
  "idProyecto": number,
  "idEmpleado": number,
  "fecha": Date,
  "resultados": [
    {
      "idTipoPrueba": number,
      "especificaciones": [
        {
          "idParametro": number,
          "resultado": string,
        }
      ]
    }
  ]
}
```

### API

#### Envia a la DB

- `paRegistrarResultados(registroResultados)`

```json
{
  "idProyecto": number,
  "idEmpleado": number,
  "fecha": Date,
  "resultados": [
    {
      "idTipoPrueba": number,
      "especificaciones": [
        {
          "idParametro": number,
          "resultado": number,
        }
      ]
    }
  ]
}
```

- Registra en la tabla relacional `id_prueba_resultado - id_parametro - resultado` y la tabla: ResultadoPrueba
- Debe cambiar la etapa del proyecto usando `paCambiarEtapaProyecto(idProyecto, etapa, fecha)`

## Escenario 2: Pintado y ensamblado

### Front

#### Envia a la API

- `POST` a `/proyecto/pintado-y-ensamblado`

```json
{
  "idProyecto": number,
  "fecha": Date
}
```

### API

#### Envia a la DB

- `paCambiarEtapaProyecto(idProyecto, etapa, fecha)`

```sql
CALL paCambiarEtapaProyecto(
  idProyecto,
  etapa,
  fecha
);
```

## Escenario 3: Control de calidad

- Nada

## Escenario 4: Sin proyecto asignado

- Nada


# [ ] CUS-11 Verificación de reparación

### Front

#### Pide a la API
- Pide el proyecto (`GET` a `/proyecto/por-id/{idProyecto}`)

### API

#### Pide a la DB
- `paObtenerProyectoPorId(idProyecto)`

```json
{
  "idProyecto": number,
  "titulo": string,
  "descripcion": string,
  "fechaInicio": Date,
  "fechaFin": Date,
  "costoManoObra": number,
  "costoRepuestos": number,
  "costoTotal": number,


  "cliente": Cliente,
  "supervisor": Empleado,
  "jefe": Empleado,
  
  "idEtapaActual": number,
  "etapaActual": string,

  "repuestos": Repuesto[],
  "especificaciones": Especificacion[],
  "resultados": Resultado[],
  "feedbacks": Feedback[],

  "empleadosActuales": Empleado[]
}
```

### Front

#### Envía a la API

- `POST` a `/proyecto/feedback`

```json
{
  "idProyecto": number,
  "idEmpleado": number,
  "id_resultado_prueba_tecnico": number,
  "aprobado": bool,
  "comentario": string,
  "fecha": Date,
  "resultados": [
    {
      "idTipoPrueba": number,
      "especificaciones": [
        {
          "idParametro": number,
          "resultado": string,
        }
      ]
    }
  ]
}
```

### API 

#### Envia a la DB

- `paRegistrarFeedback(registroFeedback)`

```json
{
  "idProyecto": number,
  "idEmpleado": number,
  "idResultadoPruebaTecnico": number,
  "aprobado": bool,
  "comentario": string,
  "fecha": Date,
  "resultados": [
    {
      "idTipoPrueba": number,
      "especificaciones": [
        {
          "idParametro": number,
          "resultado": string,
        }
      ]
    }
  ]
}
```

- Debe cambiar la etapa del proyecto usando `paCambiarEtapaProyecto(idProyecto, etapa, fecha)`
- Puede reutilizar lógica del procedimiento almacenado - `paRegistrarResultados(registroResultados)`

```json
{
  "idProyecto": number,
  "idEmpleado": number,
  "fecha": Date,
  "resultados": [
    {
      "idTipoPrueba": number,
      "especificaciones": [
        {
          "idParametro": number,
          "resultado": string,
        }
      ]
    }
  ]
}
```

# [ ] CUS-12 Visualización de detalles

### Front

#### Pide a la API
- Pide el proyecto (`GET` a `/proyecto/por-id/{idProyecto}`)

### API

#### Pide a la DB
- `paObtenerProyectoPorId(idProyecto)`

```sql
CALL paObtenerProyectoPorId(idProyecto);
```

```json
{
  "idProyecto": number,
  "titulo": string,
  "descripcion": string,
  "fechaInicio": Date,
  "fechaFin": Date,
  "costoManoObra": number,
  "costoRepuestos": number,
  "costoTotal": number,

  "idCliente": number,
  "idSupervisor": number,
  "idJefe": number,
  "idEtapaActual": number,

  "cliente": Cliente,
  "supervisor": Empleado,
  "jefe": Empleado,
  "etapaActual": string,

  "repuestos": Repuesto[],
  "especificaciones": Especificacion[],
  "resultados": ResultadoPrueba[],
  "feedbacks": Feedback[],

  "empleadosActuales": Empleado[]
}
```
# Sobre el objeto Proyecto:


```json
Proyecto
{
  "idProyecto": number,
  "titulo": string,
  "descripcion": string,
  "fechaInicio": Date,
  "fechaFin": Date,
  "costoManoObra": number,
  "costoRepuestos": number,
  "costoTotal": number,

  "idCliente": number,
  "idSupervisor": number,
  "idJefe": number,
  "idEtapaActual": number,

  "cliente": Cliente,
  "supervisor": Empleado,
  "jefe": Empleado,
  "etapaActual": string,

  "repuestos": Repuesto[],
  "especificaciones": Especificacion[],
  "resultados": ResultadoPrueba[],
  "feedbacks": Feedback[],

  "empleadosActuales": Empleado[]
}
```

```json
"repuesto": Repuesto,
Repuesto
{
  "idRepuesto": number,
  "nombre": string,
  "descripcion": string,
  "precio": number,
  "linkImg": string,
  "stockDisponible": number, 
  "stockAsignado": number,
  "stockRequerido": number
}
```

```json
  "cliente": Cliente,
Cliente
{
  "idCliente": number,
  "nombre": string,
  "ruc": string,
  "direccion": string,
  "telefono": string,
  "correo": string,
  "documentoIdentidad": string,
  "tipoDocumento": string,
}
```

```json
  "supervisor": Empleado,
  "jefe": Empleado,
  "empleadosActuales": Empleado[],
Empleado
{
  "idEmpleado": number,
  "usuario": string,
  "nombre": string,
  "apellido": string,
  "correo": string,
  "telefono": string,
  "direccion": string,
  "documentoIdentidad": string,
  "tipoDocumento": string,
  "rol": string,
}
```


```json
  "especificaciones": Especificacion[]
Especificacion
{
  "idParametro": number,
  "nombre": string,
  "unidad": string,
  "valorMaximo": number,
  "valorMinimo": number
}
```


```json
  "resultados": ResultadoPrueba[]
ResultadoPrueba
{
  "idResultadoPrueba": number,
  "idProyecto": number,
  "idEmpleado": number,
  "fecha": Date,
  "resultados": Resultado[]
}
```

```json
  "resultados": Resultado[]
Resultado
{
  "idTipoPrueba": number,
  "resultadosParametros": resultadoParametro[]
}
```

```json
  "resultadosParametros": resultadoParametro[]
resultadoParametro
{
  "idParametro": number,
  "nombre": string,
  "unidad": string,
  "resultado": string,
}
```

```json
  "feedbacks": Feedback[]
Feedback
{
  "idFeedback": number,
  "idResultadoPruebaTecnico": number,
  "idResultadoPruebaSupervisor": number,
  "aprobado": bool,
  "comentario": string
}
```


SPRINT 5
# [ ] CUS-10 Generar informe final de reparación



# [ ] CUS-09 Generar informe de control de calidad



# [ ] CUS-03 Cierre de Proyecto
