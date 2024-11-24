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

### Envia al Front
- Nada

### Recibe del Front
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

### Envia a la DB
- ``paInsertarRepuesto``

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
# [ ] CUS-08 Seguimiento de Tareas
# [ ] CUS-11 Verificación de reparación
# [ ] CUS-12 Visualización de detalles

SPRINT 5
# [ ] CUS-10 Generar informe final de reparación
# [ ] CUS-09 Generar informe de control de calidad
# [ ] CUS-03 Cierre de Proyecto