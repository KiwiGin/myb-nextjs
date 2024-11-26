---

Cliente:
  - id_cliente
  - Nombre
  - RUC
  - Dirección
  - Teléfono
  - Correo
  - Documento de Indentidad
  - Tipo de Documento de Indentidad

Empleado:
  - id_empleado
  - usuario
  - password (encriptada)
  - nombre
  - apellido
  - correo
  - teléfono
  - dirección
  - tipo_documento
  - documento_identidad
  - id_rol (Admin / Jefe / Técnico / Atención / Logística)

Proyecto:
  - id_proyecto
  - id_cliente
  - id_empleado_atencion
  - id_jefe
  - id_etapa_actual
  - id_costo
  - titulo
  - descripción

Etapa:
  - id_etapa
  - nombre

Costos:
  - id_costo
  - costo_mano_obra
  - costo_repuestos
  - costo_total

TipoPrueba:
  - id_tipo_prueba
  - nombre

Parametro:
  - id_parametro
  - id_tipo_prueba
  - unidades
  - nombre

Valor:
  - id_valor
  - id_tipo_prueba
  - id_parametro
  - valor

ResultadoPrueba:
  - id_resultado_prueba
  - id_proyecto
  - id_empleado
  - fecha

Feedback:
  - id_feedback
  - id_resultado_prueba_tecnico
  - id_resultado_prueba_jefe
  - aprobado
  - comentario

Repuesto:
  - id_repuesto
  - nombre
  - descripción
  - precio
  - link_img
  - stock_actual
  - stock_solicitado

Tablas relacionales:

- Observaciones del proyecto
    id_proyecto - observaciones

- Repuestos del proyecto
    id_proyecto - id_repuesto - cantidad

- Empleados del proyecto en una etapa dada
    id_proyecto - etapa - id_tecnico?

- Cambios de etapa del proyecto
    id_proyecto - etapa - fecha_inicio? - fecha_fin?

- Especificaciones de las pruebas del proyecto
    id_proyecto - id_tipo_prueba - id_parametro - valor_maximo? - valor_minimo?
    
- Valores de los resultados de las pruebas
    id_prueba_resultado - id_tipo_prueba - id_parametro - resultado

---

Subsistemas:
  - Proyecto
  - Cliente
  - Empleado
  - Prueba
  - Repuesto

---

1. El empleado de atención al cliente puede:
2. El técnico puede:
3. El jefe puede:
4. El empleado de logística puede:
5. El administrador puede:

---