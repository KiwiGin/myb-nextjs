# Pendientes

## Para el tipado:
- Se debe usar camelCase para los atributos. No confundir con la DB, esta sí tiene que estar en snake_case.
- Si evaluan que es facil de corregir antes de aplicar lo demás, corrijanlo, sino dejenlo así y lo corregimos la sgte semana.

## Para todos los da:
Los da no te devuelven un json de lo que tire el pa de la base de datos. Estos manejan el tipado **asi que deben devolver obejtos tipados**. Para manejar la desnormalización simplemente se le agregan parametros extra al tipo. Por ejemplo:

```ts
export interface TipoPrueba {
    idTipoPrueba?: number,
    nombre: string,
    parametros?: Parametro[]
}
```	
(Se agregan los parametros al tipo de prueba)

Entonces la función del da `obtenerPruebaConParametros` debería devolver `TipoPrueba[]` con los parametros.

## Procedimientos Almacenados

### CUS: Registro de Proyecto

- Agregar pa para obtener los empleados filtrados por rol. (El rol debe ser un parametro string)

### CUS: Registro de Cliente

- Completado

### CUS: Registro de Repuestos

- Completado

### CUS: Registro de Pruebas

- Agregar pa que permita pasar el nombre del tipo de prueba y una lista de parametros {nombre, unidad}

## Data Access y api endpoints

### CUS: Registro de Proyecto

- Agregar da para obtener los empleados filtrados por rol. (El rol debe ser un parametro string)

### CUS: Registro de Cliente

- Completado

### CUS: Registro de Repuestos

- Agregar manejo de la imageBase64 en el endpoint de la api para que la suba a firebase y mande al DA el link de la imagen.

### CUS: Registro de Pruebas

- Agregar da que permita pasar el nombre del tipo de prueba y una lista de parametros (nombre, unidad)

## Front End

### CUS: Registro de Proyecto

- Para ID Cliente, ID Supervisor y ID Jefe obviamente no se envía el ID, se usan los endpoints apropiados para listarlos y seleccionarlos.
- Para IDRepuestos y cantidades, se debe manejar con el componente de seleccionar repuestos y cantidades, sin embargo la interfaz debe formatear los datos para que se envíen como 2 array paralelos de idRepuestos y cantidades.
- Para IDParametros, se debe manejar con el componente de seleccionar pruebas y parametros, sin embargo la interfaz debe formatear los datos para que se envíen como 3 array paralelos de idParametros, valoresMáximos y valoresMínimos.

### CUS: Registro de Cliente

- Completado

### CUS: Registro de Repuestos

- Agregar manejo del import de una imagen en el front. Se deberá mandar un imageBase64 al POST de la API.

### CUS: Registro de Pruebas

- COmpletado