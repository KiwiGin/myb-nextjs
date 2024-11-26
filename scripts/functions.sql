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
    IF p_stock_actual < 0 THEN
        RAISE EXCEPTION 'El stock actual no puede ser negativo';
    END IF;
    INSERT INTO repuesto (nombre, precio, descripcion, link_img, stock_asignado, stock_disponible, stock_requerido)
    VALUES (p_nombre_repuesto, p_precio_repuesto, p_descripcion_repuesto, p_link_img, 0, p_stock_actual, 0);
END;
$$;

--pa: paObtenerRepuestos -> Obtiene todos los repuestos
create function paObtenerRepuestos()
    returns TABLE(id_repuesto integer, nombre character varying, descripcion text, precio numeric, link_img character varying, stock_actual integer, stock_requerido integer)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY SELECT r.id_repuesto,
                        r.nombre,
                        r.descripcion,
                        r.precio,
                        r.link_img,
                        (r.stock_disponible + r.stock_asignado) AS stock_actual,
                        r.stock_requerido
                 FROM repuesto r;
END;
$$;

-- pa: paObtenerProyectos -> Obtiene todos los proyectos
DROP FUNCTION IF EXISTS paObtenerProyectos();
CREATE OR REPLACE FUNCTION paObtenerProyectos()
    RETURNS TABLE
            (
                id_proyecto     INT,
                id_cliente      INT,
                id_supervisor   INT,
                id_jefe         INT,
                id_etapa_actual INT,
                costo_total     DECIMAL,
                costo_mano_obra DECIMAL,
                costo_repuestos DECIMAL,
                titulo          VARCHAR,
                descripcion     TEXT,
                fecha_inicio    DATE,
                fecha_fin       DATE,
                info_parametros info_parametro_proyecto,
                info_repuestos  info_repuesto_proyecto
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_ids_proyectos  INT[];
    v_info_parametro info_parametro_proyecto;
    v_info_repuesto  info_repuesto_proyecto;
BEGIN
    -- Obtener IDs de todos los proyectos
    SELECT ARRAY(SELECT p.id_proyecto FROM proyecto p) INTO v_ids_proyectos;

    FOR i IN 1 .. array_length(v_ids_proyectos, 1)
        LOOP
            -- Rellenar v_info_repuesto para el proyecto actual
            SELECT ARRAY_AGG(r.id_repuesto) AS ids_repuesto,
                   ARRAY_AGG(r.nombre)      AS nombres,
                   ARRAY_AGG(r.descripcion) AS descripciones,
                   ARRAY_AGG(r.precio)      AS precios,
                   ARRAY_AGG(r.link_img)    AS links_img,
                   ARRAY_AGG(prc.cantidad)  AS cantidades
            INTO v_info_repuesto
            FROM repuesto r
                     JOIN proyecto_repuestos_cantidad prc ON r.id_repuesto = prc.id_repuesto
            WHERE prc.id_proyecto = v_ids_proyectos[i];

            -- Rellenar v_info_parametro para el proyecto actual
            SELECT ARRAY_AGG(pep.id_parametro) AS ids_parametro,
                   ARRAY_AGG(p.nombre)         AS nombres,
                   ARRAY_AGG(p.unidades)       AS unidades,
                   ARRAY_AGG(pep.valor_maximo) AS valores_maximo,
                   ARRAY_AGG(pep.valor_minimo) AS valores_minimo
            INTO v_info_parametro
            FROM parametro p
                     JOIN proyecto_especificaciones_pruebas pep ON p.id_parametro = pep.id_parametro
            WHERE pep.id_proyecto = v_ids_proyectos[i];

            -- Asignar valores a los campos de salida y usar RETURN QUERY
            RETURN QUERY
                SELECT p.id_proyecto,
                       p.id_cliente,
                       p.id_supervisor,
                       p.id_jefe,
                       p.id_etapa_actual,
                       c.costo_total,
                       c.costo_mano_obra,
                       c.costo_repuestos,
                       p.titulo,
                       p.descripcion,
                       p.fechaInicio,
                       p.fechaFin,
                       v_info_parametro,
                       v_info_repuesto
                FROM proyecto p
                         JOIN costos c ON p.id_costo = c.id_costo
                WHERE p.id_proyecto = v_ids_proyectos[i];
        END LOOP;
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
    RETURN QUERY
        SELECT e.id_empleado,
               e.usuario,
               e.password,
               e.nombre,
               e.apellido,
               e.correo,
               e.telefono,
               e.direccion,
               e.tipo_documento,
               e.documento_identidad,
               e.rol
        FROM empleado e
        WHERE e.rol = p_rol;
END;
$$;

-- pa: paObtenerRepuestosRequeridos -> Obtiene los repuestos requeridos
CREATE OR REPLACE FUNCTION paObtenerRepuestosRequeridos()
    RETURNS TABLE
            (
                id_repuesto      INT,
                nombre           VARCHAR,
                descripcion      TEXT,
                precio           DECIMAL,
                link_img         VARCHAR,
                stock_disponible INT,
                stock_asignado   INT,
                stock_requerido  INT
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT r.id_repuesto,
               r.nombre,
               r.descripcion,
               r.precio,
               r.link_img,
               r.stock_disponible,
               r.stock_asignado,
               r.stock_requerido
        FROM repuesto r
        WHERE r.stock_requerido > 0;
END;
$$;

-- pa: paActualizarStock -> Actualiza el stock de un repuesto
CREATE OR REPLACE PROCEDURE paActualizarStock(
    p_id_repuesto INT,
    p_stock_adquirido INT
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE repuesto
    SET stock_disponible = stock_disponible + p_stock_adquirido,
        stock_requerido  = stock_requerido - p_stock_adquirido
    WHERE id_repuesto = p_id_repuesto;
END;
$$;

-- pa: paObtenerClientesPorIds -> Obtiene los clientes por ids
CREATE OR REPLACE FUNCTION paObtenerClientesPorIds(p_ids_cliente INT[])
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
    RETURN QUERY 
    SELECT 
        c.id_cliente,
        c.nombre,
        c.ruc,
        c.direccion,
        c.telefono,
        c.correo,
        c.documento_de_identidad,
        c.tipo_de_documento_de_identidad
    FROM cliente c
    WHERE c.id_cliente = ANY (p_ids_cliente);
END;
$$;

-- pa: paObtenerEmpleadosPorIds -> Obtiene los empleados por ids
CREATE OR REPLACE FUNCTION paObtenerEmpleadosPorIds(p_ids_empleado INT[])
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
    RETURN QUERY 
    SELECT 
        e.id_empleado,
        e.usuario,
        e.password,
        e.nombre,
        e.apellido,
        e.correo,
        e.telefono,
        e.direccion,
        e.tipo_documento,
        e.documento_identidad,
        e.rol
    FROM empleado e
    WHERE e.id_empleado = ANY (p_ids_empleado);
END;
$$;

-- pa: paObtenerRepuestosPorIds -> Obtiene los repuestos por ids
CREATE OR REPLACE FUNCTION paObtenerRepuestosPorIds(p_ids_repuesto INT[])
    RETURNS TABLE
            (
                id_repuesto      INT,
                nombre           VARCHAR,
                descripcion      TEXT,
                precio           DECIMAL,
                link_img         VARCHAR,
                stock_disponible INT,
                stock_asignado   INT,
                stock_requerido  INT
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY 
    SELECT 
        r.id_repuesto,
        r.nombre,
        r.descripcion,
        r.precio,
        r.link_img,
        r.stock_disponible,
        r.stock_asignado,
        r.stock_requerido
    FROM repuesto r
    WHERE r.id_repuesto = ANY (p_ids_repuesto);
END;
$$;


-- pa: paObtenerRepuestosPorProyecto -> Obtiene los repuestos por proyecto
CREATE OR REPLACE FUNCTION paObtenerRepuestosPorProyecto(p_id_proyecto INT)
    RETURNS TABLE
            (
                id_repuesto      INT,
                nombre           VARCHAR,
                descripcion      TEXT,
                precio           DECIMAL,
                link_img         VARCHAR,
                stock_disponible INT,
                stock_asignado   INT,
                stock_requerido  INT,
                cantidad         INT
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT r.id_repuesto,
               r.nombre,
               r.descripcion,
               r.precio,
               r.link_img,
               r.stock_disponible,
               r.stock_asignado,
               r.stock_requerido,
               prc.cantidad
        FROM repuesto r
                 JOIN proyecto_repuestos_cantidad prc ON r.id_repuesto = prc.id_repuesto
        WHERE prc.id_proyecto = p_id_proyecto;
END;
$$;

-- pa: paCambiarEtapaProyecto -> Cambia la etapa de un proyecto
CREATE OR REPLACE PROCEDURE paCambiarEtapaProyecto(
    p_id_proyecto INT,
    p_id_etapa INT,
    p_fecha_inicio DATE
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO proyecto_etapas_cambio (id_proyecto, id_etapa, fecha_inicio)
    VALUES (p_id_proyecto, p_id_etapa, p_fecha_inicio);
    UPDATE proyecto
    SET id_etapa_actual = p_id_etapa
    WHERE id_proyecto = p_id_proyecto;
END;
$$;

--pa: paAgregarRepuestosSolicitados -> Agrega repuestos solicitados
CREATE OR REPLACE PROCEDURE paAgregarRepuestosSolicitados(
    p_ids_repuestos INT[],
    p_cantidades INT[]
)
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_id_repuesto INT;
    v_cantidad    INT;
BEGIN
    IF array_length(p_ids_repuestos, 1) <> array_length(p_cantidades, 1) THEN
        RAISE EXCEPTION 'Los arreglos de repuestos y cantidades deben tener la misma longitud';
    END IF;

    FOR i IN 1..array_length(p_ids_repuestos, 1)
        LOOP
            v_id_repuesto := p_ids_repuestos[i];
            v_cantidad := p_cantidades[i];

            UPDATE repuesto
            SET stock_requerido = stock_requerido + v_cantidad
            WHERE id_repuesto = v_id_repuesto;
        END LOOP;
END;
$$;

-- paAsignarRepuestosAProyecto(proyectoId)
CREATE OR REPLACE PROCEDURE paAsignarRepuestosAProyecto(
    p_id_proyecto INT
)
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_id_repuesto INT;
    v_cantidad    INT;
BEGIN
    FOR v_id_repuesto, v_cantidad IN
        SELECT prc.id_repuesto, prc.cantidad
        FROM proyecto_repuestos_cantidad prc
        WHERE prc.id_proyecto = p_id_proyecto
        LOOP
            UPDATE repuesto
            SET stock_asignado = stock_asignado + v_cantidad,
                stock_disponible = stock_disponible - v_cantidad
            WHERE id_repuesto = v_id_repuesto;
        END LOOP;
END;
$$;

-- pa: paObtenerProyectoPorJefe -> Obtiene los proyectos de un jefe
CREATE OR REPLACE FUNCTION paObtenerProyectoPorJefe(p_id_jefe INT)
    RETURNS TABLE
            (
                id_proyecto             INT,
                titulo                  VARCHAR,
                descripcion             TEXT,
                fecha_inicio            DATE,
                fecha_fin               DATE,
                id_cliente              INT,
                id_supervisor           INT,
                id_jefe                 INT,
                id_etapa_actual         INT,
                ids_empleados_actuales  INT[]
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT p.id_proyecto,
               p.titulo,
               p.descripcion,
               p.fechaInicio,
               p.fechaFin,
               p.id_cliente,
               p.id_supervisor,
               p.id_jefe,
               p.id_etapa_actual,
               ARRAY(SELECT pe.id_tecnico
                     FROM proyecto_etapa_empleado pe
                     WHERE pe.id_proyecto = p.id_proyecto
                       AND pe.id_etapa = p.id_etapa_actual)
        FROM proyecto p
        WHERE p.id_jefe = p_id_jefe;
END;
$$;

-- paObtenerDatosProyectoPorId
CREATE OR REPLACE FUNCTION paObtenerDatosProyectoPorId(p_id_proyecto INT)
    RETURNS TABLE
            (
                id_proyecto             INT,
                titulo                  VARCHAR,
                descripcion             TEXT,
                fecha_inicio            DATE,
                fecha_fin               DATE,

                costo_mano_obra         DECIMAL,
                costo_repuestos         DECIMAL,
                costo_total             DECIMAL,

                id_cliente              INT,
                id_supervisor           INT,
                id_jefe                 INT,
                id_etapa_actual         INT,

                info_repuestos          info_repuesto_proyecto,
                info_parametros         info_parametro_proyecto,

                ids_empleados_actuales  INT[]
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_info_parametro info_parametro_proyecto;
    v_info_repuesto  info_repuesto_proyecto;
BEGIN
    -- Rellenar v_info_repuesto para el proyecto actual
    SELECT ARRAY_AGG(r.id_repuesto) AS ids_repuesto,
           ARRAY_AGG(r.nombre)      AS nombres,
           ARRAY_AGG(r.descripcion) AS descripciones,
           ARRAY_AGG(r.precio)      AS precios,
           ARRAY_AGG(r.link_img)    AS links_img,
           ARRAY_AGG(prc.cantidad)  AS cantidades
    INTO v_info_repuesto
    FROM repuesto r
             JOIN proyecto_repuestos_cantidad prc ON r.id_repuesto = prc.id_repuesto
    WHERE prc.id_proyecto = p_id_proyecto;

    -- Rellenar v_info_parametro para el proyecto actual
    SELECT ARRAY_AGG(pep.id_parametro) AS ids_parametro,
           ARRAY_AGG(p.nombre)         AS nombres,
           ARRAY_AGG(p.unidades)       AS unidades,
           ARRAY_AGG(pep.valor_maximo) AS valores_maximo,
           ARRAY_AGG(pep.valor_minimo) AS valores_minimo
    INTO v_info_parametro
    FROM parametro p
             JOIN proyecto_especificaciones_pruebas pep ON p.id_parametro = pep.id_parametro
    WHERE pep.id_proyecto = p_id_proyecto;

    -- Asignar valores a los campos de salida y usar RETURN QUERY
    RETURN QUERY
        SELECT p.id_proyecto,
               p.titulo,
               p.descripcion,
               p.fechaInicio,
               p.fechaFin,
               c.costo_mano_obra,
               c.costo_repuestos,
               c.costo_total,
               p.id_cliente,
               p.id_supervisor,
               p.id_jefe,
               p.id_etapa_actual,
               v_info_repuesto,
               v_info_parametro,
               ARRAY(SELECT pe.id_tecnico
                     FROM proyecto_etapa_empleado pe
                     WHERE pe.id_proyecto = p.id_proyecto
                       AND pe.id_etapa = p.id_etapa_actual)
        FROM proyecto p
                 JOIN costos c ON p.id_costo = c.id_costo
        WHERE p.id_proyecto = p_id_proyecto;
END;
$$;

-- pa: paobteneretapaporid -> Obtiene la etapa por id
CREATE OR REPLACE FUNCTION paobteneretapaporid(p_id_etapa INT)
    RETURNS TABLE
            (
                id_etapa          INT,
                nombre_etapa      VARCHAR
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT e.id_etapa,
               e.nombre
        FROM etapa e
        WHERE e.id_etapa = p_id_etapa;
END;
$$;

-- pa: paObtenerProyectosPorCliente -> Obtiene los proyectos de un cliente
create or replace function paObtenerRepuestosFaltantes(p_id_jefe int)
    returns table
            (
                ids_repuestos int[],
                cantidades    int[]
            )
as
$$
declare
    v_ids_proyectos           int[];
    v_ids_repuestos           int[];
    v_ids_repuestos_faltantes int[];
    v_cantidades_faltantes    int[];
    v_cantidades              int[];
    v_cantidad                int;
    v_stock_disponible        int;
begin
    select array_agg(p.id_proyecto)
    into v_ids_proyectos
    from proyecto p
    where p.id_jefe = p_id_jefe
      and p.id_etapa_actual = 1;

    for i in 1..array_length(v_ids_proyectos, 1)
        loop
            select array_agg(distinct prc.id_repuesto), array_agg(prc.cantidad)
            into v_ids_repuestos, v_cantidades
            from proyecto_repuestos_cantidad prc
            where prc.id_proyecto = v_ids_proyectos[i];
            v_ids_repuestos_faltantes := v_ids_repuestos_faltantes || v_ids_repuestos;
        end loop;

    v_ids_repuestos_faltantes := ARRAY(
        SELECT DISTINCT unnest(v_ids_repuestos_faltantes)
    );

    for i in 1..array_length(v_ids_repuestos_faltantes, 1)
        loop
            select sum(prc.cantidad)
            into v_cantidad
            from proyecto_repuestos_cantidad prc
            where prc.id_repuesto = v_ids_repuestos_faltantes[i];

            select r.stock_disponible
            into v_stock_disponible
            from repuesto r
            where r.id_repuesto = v_ids_repuestos_faltantes[i];

            v_cantidades_faltantes[i] := v_cantidad - v_stock_disponible;
        end loop;

    return query
        select
            array_agg(v_ids_repuestos_faltantes[i]),
            array_agg(v_cantidades_faltantes[i])
        from generate_series(1, array_length(v_ids_repuestos_faltantes, 1)) as i
        where v_cantidades_faltantes[i] > 0;
end;
$$ language plpgsql;


------ Sprint 5 -------
-- pa: paObtenerTecnicosDisponibles -> Obtiene los técnicos disponibles
create or replace function paObtenerTecnicosDisponibles()
    returns json
as
$$
declare
    json_result json;
begin
    SELECT json_agg(
                   json_build_object(
                           'idEmpleado', e.id_empleado,
                           'usuario', e.usuario,
                           'nombre', e.nombre,
                           'apellido', e.apellido,
                           'correo', e.correo,
                           'telefono', e.telefono,
                           'direccion', e.direccion,
                           'documentoIdentidad', e.documento_identidad,
                           'tipoDocumento', e.tipo_documento,
                           'rol', e.rol
                   )
           )

    INTO json_result
    FROM empleado e
    WHERE e.rol = 'tecnico'
      AND e.id_empleado NOT IN (SELECT pee.id_tecnico
                                FROM proyecto_etapa_empleado pee
                                         JOIN proyecto_etapas_cambio pec
                                              ON pee.id_proyecto = pec.id_proyecto
                                WHERE pec.fecha_fin IS NULL
                                   OR pec.fecha_fin > CURRENT_DATE);

    RETURN json_result;
end;
$$ language plpgsql;


-- pa: paAsignarEmpleadosAProyecto -> Asigna empleados a un proyecto
create or replace procedure paAsignarEmpleadosAProyecto(
    p_idProyecto int,
    p_idEmpleados int[],
    p_fechaAsignacion date
)
as
$$
declare
    v_ids_tecnicos_libres int[];
    v_id_etapa_prev       int;
begin
    v_ids_tecnicos_libres := (select array_agg(e.id_empleado)
                              from empleado e
                              where e.rol = 'tecnico'
                                and e.id_empleado not in (select pee.id_tecnico
                                                          from proyecto_etapa_empleado pee
                                                                   join proyecto_etapas_cambio pec
                                                                        on pee.id_proyecto = pec.id_proyecto
                                                          where pec.fecha_fin is null
                                                             or pec.fecha_fin > current_date));
    IF array_length(p_idEmpleados, 1) IS NULL THEN
        RAISE EXCEPTION 'La lista de empleados no puede estar vacía.';
    END IF;
    IF NOT p_idEmpleados <@ v_ids_tecnicos_libres THEN
        RAISE EXCEPTION 'No se puede asignar a un técnico que no está disponible';
    END IF;
    for i in 1..array_length(p_idEmpleados, 1)
        loop
            INSERT INTO proyecto_etapa_empleado (id_proyecto, id_etapa, id_tecnico)
            VALUES (p_idProyecto, 3, p_idEmpleados[i]);
        end loop;
    select p.id_etapa_actual into v_id_etapa_prev from proyecto p where p.id_proyecto = p_idProyecto;
    if v_id_etapa_prev = 2 then
        call paCambiarEtapaProyecto(p_idProyecto, 3, p_fechaAsignacion);
    else
        if v_id_etapa_prev = 6 then
            call paCambiarEtapaProyecto(p_idProyecto, 7, p_fechaAsignacion);
        end if;
    end if;
end;
$$ language plpgsql;

-- pa: paCambiarEtapaProyecto -> Cambia la etapa de un proyecto
create or replace procedure paCambiarEtapaProyecto(
    p_id_proyecto int,
    p_id_etapa int,
    p_fecha_inicio date
)
as
$$
declare
    v_id_etapa_prev int;
    v_fecha_fin_prev date;
begin
    -- Obtener la etapa previa y su fecha de inicio
    select pec.id_etapa, pec.fecha_inicio
    into v_id_etapa_prev, v_fecha_fin_prev
    from proyecto_etapas_cambio pec
    where pec.id_proyecto = p_id_proyecto
      and pec.fecha_fin is null;

    -- Si hay una etapa previa, actualizar su fecha de fin
    if v_id_etapa_prev is not null then
        update proyecto_etapas_cambio
        set fecha_fin = p_fecha_inicio
        where id_proyecto = p_id_proyecto
          and id_etapa = v_id_etapa_prev;
    end if;

    -- Verificar si la etapa que se quiere insertar ya existe
    if exists (
        select 1
        from proyecto_etapas_cambio
        where id_proyecto = p_id_proyecto
          and id_etapa = p_id_etapa
    ) then
        -- Si existe, actualizar sus fechas
        update proyecto_etapas_cambio
        set fecha_inicio = p_fecha_inicio,
            fecha_fin = null
        where id_proyecto = p_id_proyecto
          and id_etapa = p_id_etapa;
    else
        -- Si no existe, insertar la nueva etapa
        insert into proyecto_etapas_cambio (id_proyecto, id_etapa, fecha_inicio)
        values (p_id_proyecto, p_id_etapa, p_fecha_inicio);
    end if;

    -- Actualizar la etapa actual del proyecto
    update proyecto
    set id_etapa_actual = p_id_etapa
    where id_proyecto = p_id_proyecto;
end;
$$ language plpgsql;


-- pa: paObtenerProyectoPorEmpleado -> Obtiene los proyectos de un empleado
create or replace function paObtenerProyectoPorEmpleado(p_id_empleado int)
    returns json as
$$
declare
    v_ids_proyectos  int[];
    v_proyectos_json json;
    v_proyecto_json  json;
begin
    select pee.id_proyecto into v_ids_proyectos from proyecto_etapa_empleado pee where pee.id_tecnico = p_id_empleado;
    v_proyecto_json := '[]';
    for i in 1..array_length(v_ids_proyectos, 1)
        loop
            v_proyecto_json := paObtenerDatosProyectoPorId(v_ids_proyectos[i]);
            v_proyectos_json := v_proyectos_json || v_proyecto_json;
        end loop;
    return v_proyectos_json;
end;
$$ language plpgsql;

--pa: paRegistrarResultados -> Registra los resultados de una prueba
create or replace function paRegistrarResultados(
    p_registro_json json
)
    returns int as
$$
declare
    v_resultados          json[];
    v_especificaciones    json[];
    v_resultado_prueba_id int;
    v_etapa_previa        int;
begin
    insert into resultado_prueba (id_proyecto, id_empleado, fecha)
    values ((p_registro_json ->> 'idProyecto')::integer, (p_registro_json ->> 'idEmpleado')::integer,
            (p_registro_json ->> 'fecha')::date)
    returning id_resultado_prueba into v_resultado_prueba_id;
    select array(
                   select json_array_elements(p_registro_json -> 'resultados')
           )
    into v_resultados;
    for i in 1..array_length(v_resultados, 1)
        loop
            select array(
                           select json_array_elements(v_resultados[i] -> 'especificaciones')
                   )
            into v_especificaciones;
            for j in 1..array_length(v_especificaciones, 1)
                loop
                    insert into prueba_parametro_resultado (id_resultado_prueba, id_tipo_prueba, id_parametro, valor)
                    values (v_resultado_prueba_id, (v_resultados[i] ->> 'idTipoPrueba')::int,
                            (v_especificaciones[j] ->> 'idParametro')::int,
                            (v_especificaciones[j] ->> 'resultado')::numeric);
                end loop;
        end loop;
    select p.id_etapa_actual
    into v_etapa_previa
    from proyecto p
    where p.id_proyecto = (p_registro_json ->> 'idProyecto')::int;
    if v_etapa_previa = 3 then
        call paCambiarEtapaProyecto((p_registro_json ->> 'idProyecto')::int, 4, (p_registro_json ->> 'fecha')::date);
    end if;
    return v_resultado_prueba_id;
end;
$$ language plpgsql;

--pa: paRegistrarResultados -> Registra los resultados de una prueba
create or replace function paRegistrarResultados(
    p_registro_json json
)
    returns int as
$$
declare
    v_resultados          json[];
    v_especificaciones    json[];
    v_resultado_prueba_id int;
    v_etapa_previa        int;
begin
    insert into resultado_prueba (id_proyecto, id_empleado, fecha)
    values ((p_registro_json ->> 'idProyecto')::integer, (p_registro_json ->> 'idEmpleado')::integer,
            (p_registro_json ->> 'fecha')::date)
    returning id_resultado_prueba into v_resultado_prueba_id;
    select array(
                   select json_array_elements(p_registro_json -> 'resultados')
           )
    into v_resultados;
    for i in 1..array_length(v_resultados, 1)
        loop
            select array(
                           select json_array_elements(v_resultados[i] -> 'especificaciones')
                   )
            into v_especificaciones;
            for j in 1..array_length(v_especificaciones, 1)
                loop
                    insert into prueba_parametro_resultado (id_resultado_prueba, id_tipo_prueba, id_parametro, valor)
                    values (v_resultado_prueba_id, (v_resultados[i] ->> 'idTipoPrueba')::int,
                            (v_especificaciones[j] ->> 'idParametro')::int,
                            (v_especificaciones[j] ->> 'resultado')::numeric);
                end loop;
        end loop;
    select p.id_etapa_actual
    into v_etapa_previa
    from proyecto p
    where p.id_proyecto = (p_registro_json ->> 'idProyecto')::int;
    if v_etapa_previa = 3 then
        call paCambiarEtapaProyecto((p_registro_json ->> 'idProyecto')::int, 4, (p_registro_json ->> 'fecha')::date);
    end if;
    return v_resultado_prueba_id;
end;
$$ language plpgsql;


-- pa: paObtenerProyectosPorId -> Obtiene los proyectos por id
create or replace function paObtenerProyectosPorId(p_id_proyecto int)
    returns json as
$$
declare
    v_cliente_json            json;
    v_supervisor_json         json;
    v_jefe_json               json;
    v_repuestos_json          json;
    v_especificaciones_json   json;
    v_resultados_prueba_json  json;
    v_feedback_json           json;
    v_empleados_actuales_json json;
    v_proyecto_json           json;
begin
    select json_build_object(
                   'idCliente', c.id_cliente,
                   'nombre', c.nombre,
                   'ruc', c.ruc,
                   'direccion', c.direccion,
                   'telefono', c.telefono,
                   'correo', c.correo,
                   'documentoIdentidad', c.documento_de_identidad,
                   'tipoDocumento', c.tipo_de_documento_de_identidad
           )
    into v_cliente_json
    from cliente c
             join proyecto p on c.id_cliente = p.id_cliente
    where p.id_proyecto = p_id_proyecto;

    select json_build_object(
                   'idEmpleado', e.id_empleado,
                   'usuario', e.usuario,
                   'nombre', e.nombre,
                   'apellido', e.apellido,
                   'correo', e.correo,
                   'telefono', e.telefono,
                   'direccion', e.direccion,
                   'documentoIdentidad', e.documento_identidad,
                   'tipoDocumento', e.tipo_documento,
                   'rol', e.rol
           )
    into v_supervisor_json
    from empleado e
    where e.id_empleado = (select p.id_supervisor from proyecto p where p.id_proyecto = p_id_proyecto);

    select json_build_object(
                   'idEmpleado', e.id_empleado,
                   'usuario', e.usuario,
                   'nombre', e.nombre,
                   'apellido', e.apellido,
                   'correo', e.correo,
                   'telefono', e.telefono,
                   'direccion', e.direccion,
                   'documentoIdentidad', e.documento_identidad,
                   'tipoDocumento', e.tipo_documento,
                   'rol', e.rol
           )
    into v_jefe_json
    from empleado e
    where e.id_empleado = (select p.id_jefe from proyecto p where p.id_proyecto = p_id_proyecto);

    select json_agg(
                   json_build_object(
                           'idRepuesto', r.id_repuesto,
                           'nombre', r.nombre,
                           'descripcion', r.descripcion,
                           'precio', r.precio,
                           'linkImg', r.link_img,
                           'stockDisponible', r.stock_disponible,
                           'stockAsignado', r.stock_asignado,
                           'stockRequerido', r.stock_requerido,
                           'cantidad', prc.cantidad
                   )
           )
    into v_repuestos_json
    from repuesto r
             join proyecto_repuestos_cantidad prc on r.id_repuesto = prc.id_repuesto
    where prc.id_proyecto = p_id_proyecto;

    select json_agg(
                   json_build_object(
                           'idTipoPrueba', sq.id_tipo_prueba,
                           'nombre', (select tp.nombre from tipo_prueba tp where tp.id_tipo_prueba = sq.id_tipo_prueba),
                           'parametros', parametro_prueba
                   )
           )
    into v_especificaciones_json
    from (select pep.id_tipo_prueba,
                 json_agg(
                         json_build_object(
                                 'idParametro', p.id_parametro,
                                 'nombre', p.nombre,
                                 'unidad', p.unidades,
                                 'valorMaximo', pep.valor_maximo,
                                 'valorMinimo', pep.valor_minimo
                         )
                 ) as parametro_prueba
          from proyecto_especificaciones_pruebas pep
                   join parametro p on pep.id_parametro = p.id_parametro
          where pep.id_proyecto = p_id_proyecto
          group by pep.id_tipo_prueba) as sq;


    select json_agg(
                   json_build_object(
                           'idResultadoPrueba', sq2.id_resultado_prueba,
                           'idProyecto', sq2.id_proyecto,
                           'idEmpleado', sq2.id_empleado,
                           'idTipoPrueba', sq2.id_tipo_prueba,
                           'fecha', sq2.fecha,
                           'resultados', resultados
                   )
           )
    into v_resultados_prueba_json
    from (select sq.id_tipo_prueba,
                 sq.id_resultado_prueba,
                 sq.id_proyecto,
                 sq.id_empleado,
                 sq.fecha,
                 json_agg(
                         json_build_object(
                                 'idTipoPrueba', sq.id_tipo_prueba,
                                 'resultadosParametros', resultados_parametros
                         )
                 ) as resultados
          from (select prp.id_tipo_prueba,
                       prp.id_resultado_prueba,
                       rp.id_proyecto,
                       rp.fecha,
                       rp.id_empleado,
                       json_agg(
                               json_build_object(
                                       'idParametro', p.id_parametro,
                                       'nombre', p.nombre,
                                       'unidad', p.unidades,
                                       'resultado', prp.valor
                               )
                       ) as resultados_parametros
                from parametro p
                         join prueba_parametro_resultado prp on p.id_parametro = prp.id_parametro
                         join resultado_prueba rp on prp.id_resultado_prueba = rp.id_resultado_prueba
                where rp.id_proyecto = p_id_proyecto
                group by prp.id_tipo_prueba, prp.id_resultado_prueba, rp.id_proyecto, rp.fecha, rp.id_empleado) as sq
          group by sq.id_tipo_prueba, sq.id_resultado_prueba, sq.id_proyecto, sq.id_empleado, sq.fecha) as sq2;


    select json_agg(
                   json_build_object(
                           'idFeedback', f.id_feedback,
                           'idResultadoPruebaTecnico', f.id_resultado_prueba_tecnico,
                           'idResultadoPruebaSupervisor', f.id_resultado_prueba_supervisor,
                           'aprobado', f.aprobado,
                           'comentario', f.comentario
                   )
           )
    into v_feedback_json
    from feedback f
    where f.id_resultado_prueba_supervisor in (select rp.id_resultado_prueba
                                               from resultado_prueba rp
                                               where rp.id_proyecto = p_id_proyecto)
       or f.id_resultado_prueba_tecnico in (select rp.id_resultado_prueba
                                            from resultado_prueba rp
                                            where rp.id_proyecto = p_id_proyecto);

    select json_agg(
                   json_build_object(
                           'idEmpleado', e.id_empleado,
                           'usuario', e.usuario,
                           'nombre', e.nombre,
                           'apellido', e.apellido,
                           'correo', e.correo,
                           'telefono', e.telefono,
                           'direccion', e.direccion,
                           'documentoIdentidad', e.documento_identidad,
                           'tipoDocumento', e.tipo_documento,
                           'rol', e.rol
                   )
           )
    into v_empleados_actuales_json
    from empleado e
             join proyecto_etapa_empleado pee on e.id_empleado = pee.id_tecnico
    where pee.id_etapa = (select pec.id_etapa
                          from proyecto_etapas_cambio pec
                          where pec.fecha_fin is null
                            and pec.id_proyecto = p_id_proyecto)
      and pee.id_proyecto = p_id_proyecto;

    select json_build_object(
                   'idProyecto', p.id_proyecto,
                   'titulo', p.titulo,
                   'descripcion', p.descripcion,
                   'fechaInicio', p.fechaInicio,
                   'fechaFin', p.fechaFin,
                   'costoManoObra', c.costo_mano_obra,
                   'costoRepuestos', c.costo_repuestos,
                   'costoTotal', c.costo_total,
                   'idEtapaActual', p.id_etapa_actual,
                   'etapaActual', (select e.nombre from etapa e where e.id_etapa = p.id_etapa_actual),
                   'cliente', v_cliente_json,
                   'supervisor', v_supervisor_json,
                   'jefe', v_jefe_json,
                   'repuestos', v_repuestos_json,
                   'especificaciones', v_especificaciones_json,
                   'resultados', v_resultados_prueba_json,
                   'feedbacks', v_feedback_json,
                   'empleadosActuales', v_empleados_actuales_json
           )
    into v_proyecto_json
    from proyecto p
             join costos c on p.id_costo = c.id_costo
    where id_proyecto = p_id_proyecto;
    return v_proyecto_json;
end;
$$ language plpgsql;

-- pa: paRegistrarFeedback -> Registra un feedback
create or replace function paRegistrarFeedback(
    p_feedback_json json
) returns int
as
$$
declare
    v_resultados                     json;
    v_resultado_prueba_supervisor_id int;
    v_feedback_id                    int;
begin
    select json_build_object(
                   'idProyecto', p_feedback_json ->> 'idProyecto',
                   'idEmpleado', p_feedback_json ->> 'idEmpleado',
                   'fecha', p_feedback_json ->> 'fecha',
                   'resultados', p_feedback_json -> 'resultados'
           )
    into v_resultados;
    select * into v_resultado_prueba_supervisor_id from paRegistrarResultados(v_resultados);
    insert into feedback (id_resultado_prueba_tecnico, id_resultado_prueba_supervisor, aprobado, comentario)
    values ((p_feedback_json ->> 'idResultadoPruebaTecnico')::integer, v_resultado_prueba_supervisor_id,
            (p_feedback_json ->> 'aprobado')::boolean, p_feedback_json ->> 'comentario')
    returning id_feedback into v_feedback_id;
    if (p_feedback_json ->> 'aprobado')::boolean then
        call paCambiarEtapaProyecto((p_feedback_json ->> 'idProyecto')::int, 5, (p_feedback_json ->> 'fecha')::date);
    else
        call paCambiarEtapaProyecto((p_feedback_json ->> 'idProyecto')::int, 3, (p_feedback_json ->> 'fecha')::date);
    end if;
    return v_feedback_id;
end;
$$ language plpgsql;
