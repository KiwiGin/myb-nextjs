-- pa: paInsertarCliente -> Inserta un cliente
CREATE OR REPLACE PROCEDURE paCrearCliente(
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
    v_cost_repuestos := 0;

    IF array_length(p_ids_repuestos, 1) <> array_length(p_cantidades_repuestos, 1) THEN
        RAISE EXCEPTION 'Los arreglos de repuestos y cantidades deben tener la misma longitud';
    END IF;

    FOR i IN 1..array_length(p_ids_repuestos, 1)
        LOOP
            v_id_repuesto := p_ids_repuestos[i];
            v_cantidad_repuesto := p_cantidades_repuestos[i];

            SELECT repuesto.precio * v_cantidad_repuesto
            INTO v_costo_unitario
            FROM repuesto
            WHERE repuesto.id_repuesto = v_id_repuesto;

            IF FOUND THEN
                IF v_costo_unitario IS NOT NULL THEN
                    v_cost_repuestos := v_cost_repuestos + v_costo_unitario;
                ELSE
                    RAISE EXCEPTION 'El repuesto % no tiene precio asignado', v_id_repuesto;
                END IF;
            ELSE
                RAISE EXCEPTION 'Repuesto con id % no encontrado', v_id_repuesto;
            END IF;
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
$$;

-- pa: paRegistrarRepuesto -> Registra un repuesto
CREATE OR REPLACE PROCEDURE paRegistrarRepuesto(
    p_nombre_repuesto VARCHAR,
    p_precio_repuesto DECIMAL(10, 2),
    p_descripcion_repuesto TEXT,
    p_link_img VARCHAR,
    p_stock_actual INTEGER
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO repuesto (nombre, precio, descripcion, link_img, stock_actual)
    VALUES (p_nombre_repuesto, p_precio_repuesto, p_descripcion_repuesto, p_link_img, p_stock_actual);
END;
$$;

--pa: paObtenerRepuestos -> Obtiene todos los repuestos
CREATE OR REPLACE FUNCTION paObtenerRepuestos()
    returns TABLE
            (
                id_repuesto      integer,
                nombre           character varying,
                descripcion      text,
                precio           numeric,
                link_img         character varying,
                stock_actual     integer,
                stock_solicitado integer
            )
    language plpgsql
as
$$
BEGIN
    RETURN QUERY SELECT * FROM repuesto;
END;
$$;

-- pa: paObtenerProyectos -> Obtiene todos los proyectos
CREATE OR REPLACE FUNCTION paObtenerProyectos()
    RETURNS TABLE
            (
                id_proyecto     INT,
                id_cliente      INT,
                id_supervisor   INT,
                id_jefe         INT,
                id_etapa_actual INT,
                id_costo        INT,
                titulo          VARCHAR,
                descripcion     TEXT,
                fechaInicio     DATE,
                fechaFin        DATE
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM proyecto;
END;
$$;

-- pa: paActualizarStockRepuesto -> Actualiza el stock de un repuesto
CREATE OR REPLACE PROCEDURE paActualizarStockRepuesto(
    p_id_repuesto INT,
    p_cantidad INT
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE repuesto
    SET stock_actual = stock_actual + p_cantidad
    WHERE id_repuesto = p_id_repuesto;
END;
$$;

-- pa: paCrearTipoPrueba -> Crea un tipo de prueba
CREATE OR REPLACE FUNCTION paCrearTipoPrueba(p_nombre_prueba VARCHAR)
    RETURNS INT AS
$$
DECLARE
    new_id INT;
BEGIN
    INSERT INTO tipo_prueba (nombre)
    VALUES (p_nombre_prueba)
    RETURNING id_tipo_prueba INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- pa: paCrearParametro -> Crea un parametro
CREATE OR REPLACE PROCEDURE paCrearParametro(
    p_nombre_parametro VARCHAR,
    p_unidades VARCHAR,
    p_id_tipo_prueba INT
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO parametro (nombre, unidades, id_tipo_prueba)
    VALUES (p_nombre_parametro, p_unidades, p_id_tipo_prueba);
END;
$$;

-- pa: paCrearPruebaParametros -> Crea una prueba con parametros y retorna la IS
CREATE OR REPLACE FUNCTION paCrearPruebaParametros(
    p_nombre_prueba VARCHAR,
    p_nombres_parametros VARCHAR[],
    p_unidades_parametros VARCHAR[]
)
    RETURNS INT
    LANGUAGE plpgsql
AS
$$
DECLARE
    id_tipo_prueba INT;
BEGIN
    id_tipo_prueba := paCrearTipoPrueba(p_nombre_prueba);

    FOR i IN 1..array_length(p_nombres_parametros, 1)
        LOOP
            PERFORM paCrearParametro(p_nombres_parametros[i], p_unidades_parametros[i], id_tipo_prueba);
        END LOOP;
    RETURN id_tipo_prueba;
END;
$$;


--pa: paObtenerEmpleadosPorRol -> Obtiene los empleados por rol
CREATE OR REPLACE FUNCTION paObtenerEmpleadosPorRol(p_rol VARCHAR)
    RETURNS TABLE
            (
                id_empleado         INT,
                usuario             VARCHAR,
                password            VARCHAR,
                nombre              VARCHAR,
                apellido            VARCHAR,
                correo              VARCHAR,
                telefono            VARCHAR,
                direccion           VARCHAR,
                tipo_documento      VARCHAR,
                documento_identidad VARCHAR,
                rol                 VARCHAR
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY SELECT * FROM empleado WHERE rol = p_rol;
END;
$$;

