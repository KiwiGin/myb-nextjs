-- pa: paInsertarCliente -> Inserta un cliente
CREATE OR REPLACE PROCEDURE paInsertarCliente(
    p_Nombre VARCHAR,
    p_RUC VARCHAR,
    p_Direccion VARCHAR,
    p_Telefono VARCHAR,
    p_Correo VARCHAR,
    p_Documento_de_Identidad VARCHAR,
    p_Tipo_de_Documento_de_Identidad VARCHAR
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO Cliente (Nombre,
                         RUC,
                         Direccion,
                         Telefono,
                         Correo,
                         Documento_de_Identidad,
                         Tipo_de_Documento_de_Identidad)
    VALUES (p_Nombre,
            p_RUC,
            p_Direccion,
            p_Telefono,
            p_Correo,
            p_Documento_de_Identidad,
            p_Tipo_de_Documento_de_Identidad);
END;
$$;

-- pa: paObtenerClientes -> Obtiene todos los clientes
CREATE OR REPLACE FUNCTION paObtenerClientes()
    RETURNS TABLE
            (
                id_cliente                     INT,
                nombre                         VARCHAR,
                ruc                            VARCHAR,
                direccion                      VARCHAR,
                telefono                       VARCHAR,
                correo                         VARCHAR,
                documento_de_identidad         VARCHAR,
                tipo_de_documento_de_identidad VARCHAR
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM Cliente;
END;
$$;


-- pa: paObtenerPruebaConParametros -> Devuelve las pruebas y parametros
CREATE OR REPLACE FUNCTION paObtenerPruebaConParametros()
    RETURNS TABLE
            (
                id_tipo_prueba   INT,
                nombre_prueba    VARCHAR,
                id_parametro     INT,
                nombre_parametro VARCHAR,
                unidades         VARCHAR
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT tp.id_tipo_prueba,
               tp.nombre,
               p.id_parametro,
               p.nombre,
               p.unidades
        FROM tipo_prueba tp
                 JOIN parametro p ON tp.id_tipo_prueba = p.id_tipo_prueba;
END;
$$;

CREATE OR REPLACE PROCEDURE paInsertarProyecto(
    p_titulo_proyecto VARCHAR(255),
    p_descripcion_proyecto TEXT,
    p_fecha_inicio_proyecto DATE,
    p_fecha_fin_proyecto DATE,
    p_id_cliente INT,
    p_id_supervisor INT,
    p_id_jefe INT,
    p_costo_mano_obra DECIMAL(10, 2),
    p_ids_repuestos INT[],
    p_cantidades_repuestos INT[],
    p_ids_parametros INT[],
    p_valores_maximos DECIMAL(10, 2)[],
    p_valores_minimos DECIMAL(10, 2)[]
)
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_id_costo          INT;
    v_cost_repuestos    DECIMAL(10, 2);
    v_id_repuesto       INT;
    v_cantidad_repuesto INT;
    v_costo_unitario    DECIMAL(10, 2);
    v_id_etapa          INT;
    v_id_proyecto       INT;
    v_id_tipo_prueba    INT;
BEGIN
    -- calcular el costo de repuestos:
    FOR i IN 1..array_length(p_ids_repuestos, 1)
        LOOP
            v_id_repuesto := p_ids_repuestos[i];
            v_cantidad_repuesto := p_cantidades_repuestos[i];

            SELECT repuesto.precio * v_cantidad_repuesto
            INTO v_costo_unitario
            FROM repuesto
            WHERE repuesto.id_repuesto = v_id_repuesto;

            v_cost_repuestos := v_cost_repuestos + v_costo_unitario;
        END LOOP;
-- Insertar el costo:
    INSERT INTO costos (costo_mano_obra, costo_repuestos, costo_total)
    VALUES (p_costo_mano_obra, v_cost_repuestos, p_costo_mano_obra + v_cost_repuestos)
    RETURNING id_costo INTO v_id_costo;
-- Etapa actual:
    v_id_etapa := 1;
    -- Etapa de asignación de repuestos
-- Insertar el proyecto:
    INSERT INTO proyecto (id_cliente, id_supervisor, id_jefe, id_etapa_actual, id_costo, titulo, descripcion,
                          fechaInicio, fechaFin)
    VALUES (p_id_cliente, p_id_supervisor, p_id_jefe, v_id_etapa, v_id_costo, p_titulo_proyecto, p_descripcion_proyecto,
            p_fecha_inicio_proyecto, p_fecha_fin_proyecto)
    RETURNING id_proyecto INTO v_id_proyecto;
-- Insertar las pruebas:
    FOR i IN 1..array_length(p_ids_parametros, 1)
        LOOP
            -- Obtener el id_tipo_prueba:
            SELECT tp.id_tipo_prueba
            INTO v_id_tipo_prueba
            FROM parametro
                     JOIN tipo_prueba tp ON parametro.id_tipo_prueba = tp.id_tipo_prueba
            WHERE parametro.id_parametro = p_ids_parametros[i];

            INSERT INTO proyecto_especificaciones_pruebas (id_proyecto, id_tipo_prueba, id_parametro, valor_maximo,
                                                           valor_minimo)
            VALUES (v_id_proyecto, v_id_tipo_prueba, p_ids_parametros[i], p_valores_maximos[i], p_valores_minimos[i]);
        END LOOP;
-- Insertar los repuestos:
    FOR i IN 1..array_length(p_ids_repuestos, 1)
        LOOP
            INSERT INTO proyecto_repuestos_cantidad (id_proyecto, id_repuesto, cantidad)
            VALUES (v_id_proyecto, p_ids_repuestos[i], p_cantidades_repuestos[i]);
        END LOOP;
-- Insertar etapa cambio:
    INSERT INTO proyecto_etapas_cambio (id_proyecto, id_etapa, fecha_inicio, fecha_fin)
    VALUES (v_id_proyecto, v_id_etapa, p_fecha_inicio_proyecto, null);
END;
$$