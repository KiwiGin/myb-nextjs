
comment on database postgres is 'default administrative connection database';

create type info_parametro_proyecto as
(
    ids_parametro  integer[],
    nombres        varchar(255)[],
    unidades       varchar(50)[],
    valores_maximo numeric(10, 2)[],
    valores_minimo numeric(10, 2)[]
);

alter type info_parametro_proyecto owner to jose_sernaque;

create type info_repuesto_proyecto as
(
    ids_repuesto  integer[],
    nombres       varchar(255)[],
    descripciones text[],
    precios       numeric(10, 2)[],
    links_img     varchar(255)[],
    cantidades    integer[]
);

alter type info_repuesto_proyecto owner to jose_sernaque;

create table cliente
(
    id_cliente serial
        primary key,
    nombre     varchar(255) not null,
    ruc        varchar(20)  not null,
    direccion  varchar(255),
    telefono   varchar(20),
    correo     varchar(255)
);

alter table cliente
    owner to jose_sernaque;

create table repuesto
(
    id_repuesto      serial
        primary key,
    nombre           varchar(255)   not null,
    descripcion      text,
    precio           numeric(10, 2) not null,
    link_img         varchar(255),
    stock_disponible integer default 0,
    stock_asignado   integer default 0,
    stock_requerido  integer default 0
);

alter table repuesto
    owner to jose_sernaque;

create table tipo_prueba
(
    id_tipo_prueba serial
        primary key,
    nombre         varchar(255) not null
);

alter table tipo_prueba
    owner to jose_sernaque;

create table parametro
(
    id_parametro   serial,
    id_tipo_prueba integer      not null
        references tipo_prueba
            on delete cascade,
    unidades       varchar(50),
    nombre         varchar(255) not null,
    primary key (id_parametro, id_tipo_prueba)
);

alter table parametro
    owner to jose_sernaque;

create table empleado
(
    id_empleado         serial
        primary key,
    password            varchar(255) not null,
    nombre              varchar(255) not null,
    apellido            varchar(255) not null,
    correo              varchar(255) not null
        unique,
    telefono            varchar(20),
    direccion           varchar(255),
    tipo_documento      varchar(20),
    documento_identidad varchar(50)
        unique,
    rol                 varchar(50)  not null,
    link_img            varchar(255)
);

alter table empleado
    owner to jose_sernaque;

create table etapa
(
    id_etapa serial
        primary key,
    nombre   varchar(255) not null
);

alter table etapa
    owner to jose_sernaque;

create table costos
(
    id_costo        serial
        primary key,
    costo_mano_obra numeric(10, 2) not null,
    costo_repuestos numeric(10, 2) not null,
    costo_total     numeric(10, 2) not null
);

alter table costos
    owner to jose_sernaque;

create table proyecto
(
    id_proyecto     serial
        primary key,
    id_cliente      integer      not null
        references cliente
            on delete set null,
    id_supervisor   integer      not null
        references empleado
            on delete set null,
    id_jefe         integer      not null
        references empleado
            on delete set null,
    id_etapa_actual integer
                                 references etapa
                                     on delete set null,
    id_costo        integer
                                 references costos
                                     on delete set null,
    titulo          varchar(255) not null,
    descripcion     text,
    fechainicio     date         not null,
    fechafin        date
);

alter table proyecto
    owner to jose_sernaque;

create table proyecto_especificaciones_pruebas
(
    id_proyecto    integer not null
        references proyecto
            on delete cascade,
    id_tipo_prueba integer not null
        references tipo_prueba
            on delete cascade,
    id_parametro   integer not null,
    valor_maximo   numeric(10, 2),
    valor_minimo   numeric(10, 2),
    primary key (id_proyecto, id_tipo_prueba, id_parametro),
    constraint proyecto_especificaciones_prue_id_parametro_id_tipo_prueba_fkey
        foreign key (id_parametro, id_tipo_prueba) references parametro
            on delete cascade
);

alter table proyecto_especificaciones_pruebas
    owner to jose_sernaque;

create table proyecto_repuestos_cantidad
(
    id_proyecto integer not null
        references proyecto
            on delete cascade,
    id_repuesto integer not null
        references repuesto
            on delete cascade,
    cantidad    integer not null,
    primary key (id_proyecto, id_repuesto)
);

alter table proyecto_repuestos_cantidad
    owner to jose_sernaque;

create table proyecto_etapa_empleado
(
    id_proyecto integer not null
        references proyecto,
    id_etapa    integer not null
        references etapa,
    id_tecnico  integer not null
        references empleado,
    primary key (id_proyecto, id_etapa, id_tecnico)
);

alter table proyecto_etapa_empleado
    owner to jose_sernaque;

create table resultado_prueba
(
    id_resultado_prueba serial
        primary key,
    id_proyecto         integer not null,
    id_empleado         integer not null,
    fecha               date    not null
);

alter table resultado_prueba
    owner to jose_sernaque;

create table prueba_parametro_resultado
(
    id_resultado_prueba integer        not null
        references resultado_prueba
            on delete cascade,
    id_tipo_prueba      integer        not null
        references tipo_prueba
            on delete cascade,
    id_parametro        integer        not null,
    valor               numeric(10, 2) not null,
    primary key (id_resultado_prueba, id_tipo_prueba, id_parametro),
    foreign key (id_parametro, id_tipo_prueba) references parametro
        on delete cascade
);

alter table prueba_parametro_resultado
    owner to jose_sernaque;

create table feedback
(
    id_feedback                    serial
        primary key,
    id_resultado_prueba_tecnico    integer not null
        references resultado_prueba
            on delete cascade,
    id_resultado_prueba_supervisor integer not null
        references resultado_prueba
            on delete cascade,
    aprobado                       boolean not null,
    comentario                     text
);

alter table feedback
    owner to jose_sernaque;

create table proyecto_etapas_cambio
(
    id_proyecto_etapas_cambio serial
        primary key,
    id_proyecto               integer
        references proyecto,
    id_etapa                  integer
        references etapa,
    fecha_inicio              date,
    fecha_fin                 date
);

alter table proyecto_etapas_cambio
    owner to jose_sernaque;

create function paobtenerpruebaconparametros()
    returns TABLE(id_tipo_prueba integer, nombre_prueba character varying, id_parametro integer, nombre_parametro character varying, unidades character varying)
    language plpgsql
as
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

alter function paobtenerpruebaconparametros() owner to jose_sernaque;

create procedure painsertarproyecto(IN p_titulo_proyecto character varying, IN p_descripcion_proyecto text, IN p_fecha_inicio_proyecto date, IN p_fecha_fin_proyecto date, IN p_id_cliente integer, IN p_id_supervisor integer, IN p_id_jefe integer, IN p_costo_mano_obra numeric, IN p_ids_repuestos integer[], IN p_cantidades_repuestos integer[], IN p_ids_parametros integer[], IN p_valores_maximos numeric[], IN p_valores_minimos numeric[])
    language plpgsql
as
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

alter procedure painsertarproyecto(varchar, text, date, date, integer, integer, integer, numeric, integer[], integer[], integer[], numeric[], numeric[]) owner to jose_sernaque;

create procedure paregistrarrepuesto(IN p_nombre_repuesto character varying, IN p_precio_repuesto numeric, IN p_descripcion_repuesto text, IN p_link_img character varying, IN p_stock_actual integer)
    language plpgsql
as
$$
BEGIN
    IF p_stock_actual < 0 THEN
        RAISE EXCEPTION 'El stock actual no puede ser negativo';
    END IF;
    INSERT INTO repuesto (nombre, precio, descripcion, link_img, stock_asignado, stock_disponible, stock_requerido)
    VALUES (p_nombre_repuesto, p_precio_repuesto, p_descripcion_repuesto, p_link_img, 0, p_stock_actual, 0);
END;
$$;

alter procedure paregistrarrepuesto(varchar, numeric, text, varchar, integer) owner to jose_sernaque;

create function paobtenerproyectos()
    returns TABLE(id_proyecto integer, id_cliente integer, id_supervisor integer, id_jefe integer, id_etapa_actual integer, costo_total numeric, costo_mano_obra numeric, costo_repuestos numeric, titulo character varying, descripcion text, fecha_inicio date, fecha_fin date, info_parametros info_parametro_proyecto, info_repuestos info_repuesto_proyecto)
    language plpgsql
as
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

alter function paobtenerproyectos() owner to jose_sernaque;

create procedure pacrearparametro(IN p_nombre_parametro character varying, IN p_unidades character varying, IN p_id_tipo_prueba integer)
    language plpgsql
as
$$
BEGIN
    INSERT INTO parametro (nombre, unidades, id_tipo_prueba)
    VALUES (p_nombre_parametro, p_unidades, p_id_tipo_prueba);
END;
$$;

alter procedure pacrearparametro(varchar, varchar, integer) owner to jose_sernaque;

create function pacrearpruebaparametros(p_nombre_prueba character varying, p_nombres_parametros character varying[], p_unidades_parametros character varying[]) returns integer
    language plpgsql
as
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

alter function pacrearpruebaparametros(varchar, character varying[], character varying[]) owner to jose_sernaque;

create function paobtenerrepuestosrequeridos()
    returns TABLE(id_repuesto integer, nombre character varying, descripcion text, precio numeric, link_img character varying, stock_disponible integer, stock_asignado integer, stock_requerido integer)
    language plpgsql
as
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

alter function paobtenerrepuestosrequeridos() owner to jose_sernaque;

create procedure paactualizarstock(IN p_id_repuesto integer, IN p_stock_adquirido integer)
    language plpgsql
as
$$
BEGIN
    UPDATE repuesto
    SET stock_disponible = stock_disponible + p_stock_adquirido,
        stock_requerido  = stock_requerido - p_stock_adquirido
    WHERE id_repuesto = p_id_repuesto;
END;
$$;

alter procedure paactualizarstock(integer, integer) owner to jose_sernaque;

create function paobtenerrepuestosporproyecto(p_id_proyecto integer)
    returns TABLE(id_repuesto integer, nombre character varying, descripcion text, precio numeric, link_img character varying, stock_disponible integer, stock_asignado integer, stock_requerido integer, cantidad integer)
    language plpgsql
as
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

alter function paobtenerrepuestosporproyecto(integer) owner to jose_sernaque;

create procedure paagregarrepuestossolicitados(IN p_ids_repuestos integer[], IN p_cantidades integer[])
    language plpgsql
as
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

alter procedure paagregarrepuestossolicitados(integer[], integer[]) owner to jose_sernaque;

create function paobtenerrepuestos()
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

alter function paobtenerrepuestos() owner to jose_sernaque;

create procedure paasignarrepuestosaproyecto(IN p_id_proyecto integer)
    language plpgsql
as
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

alter procedure paasignarrepuestosaproyecto(integer) owner to jose_sernaque;

create function paobtenerproyectoporjefe(p_id_jefe integer)
    returns TABLE(id_proyecto integer, titulo character varying, descripcion text, fecha_inicio date, fecha_fin date, id_cliente integer, id_supervisor integer, id_jefe integer, id_etapa_actual integer, ids_empleados_actuales integer[])
    language plpgsql
as
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

alter function paobtenerproyectoporjefe(integer) owner to jose_sernaque;

create function paobtenerdatosproyectoporid(p_id_proyecto integer)
    returns TABLE(id_proyecto integer, titulo character varying, descripcion text, fecha_inicio date, fecha_fin date, costo_mano_obra numeric, costo_repuestos numeric, costo_total numeric, id_cliente integer, id_supervisor integer, id_jefe integer, id_etapa_actual integer, info_repuestos info_repuesto_proyecto, info_parametros info_parametro_proyecto, ids_empleados_actuales integer[])
    language plpgsql
as
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

alter function paobtenerdatosproyectoporid(integer) owner to jose_sernaque;

create function paobteneretapaporid(p_id_etapa integer)
    returns TABLE(id_etapa integer, nombre_etapa character varying)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
        SELECT e.id_etapa,
               e.nombre
        FROM etapa e
        WHERE e.id_etapa = p_id_etapa;
END;
$$;

alter function paobteneretapaporid(integer) owner to jose_sernaque;

create function paobtenerrepuestosfaltantes(p_id_jefe integer)
    returns TABLE(ids_repuestos integer[], cantidades integer[])
    language plpgsql
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
$$;

alter function paobtenerrepuestosfaltantes(integer) owner to jose_sernaque;

create function paobtenerrepuestosporids(p_ids_repuesto integer[])
    returns TABLE(id_repuesto integer, nombre character varying, descripcion text, precio numeric, link_img character varying, stock_disponible integer, stock_asignado integer, stock_requerido integer)
    language plpgsql
as
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

alter function paobtenerrepuestosporids(integer[]) owner to jose_sernaque;

create function paregistrarresultados(p_registro_json json) returns integer
    language plpgsql
as
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
        perform paCambiarEtapaProyecto((p_registro_json ->> 'idProyecto')::int, 4, (p_registro_json ->> 'fecha')::date);
    end if;
    return v_resultado_prueba_id;
end;
$$;

comment on function paregistrarresultados(json) is 'Registra los resultados de una prueba';

alter function paregistrarresultados(json) owner to jose_sernaque;

create function paobtenerproyectoportecnico(p_id_empleado integer) returns json
    language plpgsql
as
$$
declare
    v_ids_proyecto  int[];
    v_proyecto_json json;
begin
    select array(
                   select case
                              when p.id_etapa_actual = 3 then (select pee2.id_proyecto
                                                               from proyecto_etapa_empleado pee2
                                                               where pee2.id_proyecto = p.id_proyecto
                                                                 and pee2.id_etapa = 3
                                                                 and pee2.id_tecnico = p_id_empleado)
                              when p.id_etapa_actual = 4 then (select pee2.id_proyecto
                                                               from proyecto_etapa_empleado pee2
                                                               where pee2.id_proyecto = p.id_proyecto
                                                                 and pee2.id_etapa = 3
                                                                 and pee2.id_tecnico = p_id_empleado)
                              when p.id_etapa_actual = 7 then (select pee2.id_proyecto
                                                               from proyecto_etapa_empleado pee2
                                                               where pee2.id_proyecto = p.id_proyecto
                                                                 and pee2.id_etapa = 7
                                                                 and pee2.id_tecnico = p_id_empleado)
                              end
                   from proyecto p
           )
    into v_ids_proyecto;
    v_ids_proyecto := array_remove(v_ids_proyecto, null);
    if array_length(v_ids_proyecto, 1) = 0 then
        return '[]'::json;
    end if;
    select * into v_proyecto_json from paObtenerProyectosPorId(v_ids_proyecto[1]);
    return v_proyecto_json;
end;
$$;

comment on function paobtenerproyectoportecnico(integer) is 'Obtiene los proyectos por tecnico';

alter function paobtenerproyectoportecnico(integer) owner to jose_sernaque;

create function paxregistrarcliente(cliente_json json) returns integer
    language plpgsql
as
$$
declare
    nuevo_cliente_id int;
begin
    insert into cliente(nombre,
                        ruc,
                        direccion,
                        telefono,
                        correo,
                        documento_de_identidad,
                        tipo_de_documento_de_identidad)
    values ((cliente_json ->> 'nombre')::varchar,
            (cliente_json ->> 'ruc')::varchar,
            (cliente_json ->> 'direccion')::varchar,
            (cliente_json ->> 'telefono')::varchar,
            (cliente_json ->> 'correo')::varchar,
            (cliente_json ->> 'documento_de_identidad')::varchar,
            (cliente_json ->> 'tipo_de_documento_de_identidad')::varchar)
    returning id_cliente into nuevo_cliente_id;
    return nuevo_cliente_id;
end;
$$;

comment on function paxregistrarcliente(json) is 'Registra un cliente en la base de datos';

alter function paxregistrarcliente(json) owner to jose_sernaque;

create function paxregistrarempleado(empleado_json json) returns integer
    language plpgsql
as
$$
declare
    nuevo_empleado_id int;
begin
    insert into empleado(password,
                         nombre,
                         apellido,
                         correo,
                         telefono,
                         direccion,
                         tipo_documento,
                         documento_identidad,
                         rol,
                         link_img)
    values ((empleado_json ->> 'password')::varchar,
            (empleado_json ->> 'nombre')::varchar,
            (empleado_json ->> 'apellido')::varchar,
            (empleado_json ->> 'correo')::varchar,
            (empleado_json ->> 'telefono')::varchar,
            (empleado_json ->> 'direccion')::varchar,
            (empleado_json ->> 'tipo_documento')::varchar,
            (empleado_json ->> 'documento_identidad')::varchar,
            (empleado_json ->> 'rol')::varchar,
            (empleado_json ->> 'link_img')::varchar)
    returning id_empleado into nuevo_empleado_id;
    return nuevo_empleado_id;
end;
$$;

comment on function paxregistrarempleado(json) is 'Registra un empleado en la base de datos';

alter function paxregistrarempleado(json) owner to jose_sernaque;

create function paxobtenerclientes() returns json
    language plpgsql
as
$$
declare
    clientes json;
begin
    select json_agg(json_build_object(
            'idCliente', c.id_cliente,
            'nombre', c.nombre,
            'ruc', c.ruc,
            'direccion', c.direccion,
            'telefono', c.telefono,
            'correo', c.correo,
            'documentoDeIdentidad', c.documento_de_identidad,
            'tipoDeDocumentoDeIdentidad', c.tipo_de_documento_de_identidad))
    into clientes
    from cliente c;
    return clientes;
end;
$$;

comment on function paxobtenerclientes() is 'Obtiene la lista de clientes';

alter function paxobtenerclientes() owner to jose_sernaque;

create function paxobtenerpruebasconparametros() returns json
    language plpgsql
as
$$
declare
    pruebas json;
begin
    with parametros_por_prueba as (select tp.id_tipo_prueba,
                                          tp.nombre,
                                          coalesce(
                                                  json_agg(
                                                          json_build_object(
                                                                  'idParametro', p.id_parametro,
                                                                  'unidades', p.unidades,
                                                                  'nombre', p.nombre
                                                          )
                                                  ),
                                                  '[]'::json
                                          ) as parametro_info
                                   from tipo_prueba tp
                                            left join parametro p
                                                      on tp.id_tipo_prueba = p.id_tipo_prueba
                                   group by tp.id_tipo_prueba, tp.nombre)
    select json_agg(
                   json_build_object(
                           'idTipoPrueba', p.id_tipo_prueba,
                           'nombre', p.nombre,
                           'parametros', p.parametro_info
                   )
           )
    into pruebas
    from parametros_por_prueba p;

    return pruebas;
end;
$$;

comment on function paxobtenerpruebasconparametros() is 'Obtiene la lista de pruebas con sus parametros';

alter function paxobtenerpruebasconparametros() owner to jose_sernaque;

create function paxinsertarproyecto(proyecto_json json) returns integer
    language plpgsql
as
$$
declare
    repuestos_array         json[];
    costo_total_repuestos   decimal;
    costo_unitario_repuesto decimal;
    nuevo_costo_id          int;
    nuevo_proyecto_id       int;
    parametros_array        json[];
    tipo_prueba_id          int;
begin
    select array(
                   select json_array_elements(proyecto_json -> 'repuestos')
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            select (r.precio * (repuestos_array[i] ->> 'cantidad')::int)
            into costo_unitario_repuesto
            from repuesto r
            where r.id_repuesto = (repuestos_array[i] ->> 'idRepuesto')::int;
            costo_total_repuestos := costo_total_repuestos + costo_unitario_repuesto;
        end loop;

    insert into costos(costo_mano_obra, costo_repuestos, costo_total)
    values ((proyecto_json ->> 'costoManoDeObra')::decimal,
            costo_total_repuestos,
            (proyecto_json ->> 'costoManoDeObra')::decimal + costo_total_repuestos)
    returning id_costo into nuevo_costo_id;
    insert into proyecto(id_cliente,
                         id_supervisor,
                         id_jefe,
                         id_etapa_actual,
                         id_costo,
                         titulo,
                         descripcion,
                         fechainicio,
                         fechafin)
    values ((proyecto_json ->> 'idCliente')::int,
            (proyecto_json ->> 'idSupervisor')::int,
            (proyecto_json ->> 'idJefe')::int,
            1,
            nuevo_costo_id,
            (proyecto_json ->> 'titulo')::varchar,
            (proyecto_json ->> 'descripcion')::text,
            (proyecto_json ->> 'fechaInicio')::date,
            (proyecto_json ->> 'fechaFin')::date)
    returning id_proyecto into nuevo_proyecto_id;
    select array(
                   select json_array_elements(proyecto_json -> 'parametros')
           )
    into parametros_array;
    for i in 1..array_length(parametros_array, 1)
        loop
            select tp.id_tipo_prueba
            into tipo_prueba_id
            from parametro p
                     join tipo_prueba tp on p.id_tipo_prueba = tp.id_tipo_prueba
            where p.id_parametro = (parametros_array[i] ->> 'idParametro')::int;
            insert into proyecto_especificaciones_pruebas(id_proyecto,
                                                          id_tipo_prueba,
                                                          id_parametro,
                                                          valor_maximo,
                                                          valor_minimo)
            values (nuevo_proyecto_id, tipo_prueba_id,
                    (parametros_array[i] ->> 'idParametro')::int,
                    (parametros_array[i] ->> 'valorMaximo')::decimal,
                    (parametros_array[i] ->> 'valorMinimo')::decimal);
        end loop;
    for i in 1..array_length(repuestos_array, 1)
        loop
            insert into proyecto_repuestos_cantidad(id_proyecto,
                                                    id_repuesto,
                                                    cantidad)
            values (nuevo_proyecto_id,
                    (repuestos_array[i] ->> 'idRepuesto')::int,
                    (repuestos_array[i] ->> 'cantidad')::int);
        end loop;
    insert into proyecto_etapas_cambio(id_proyecto, id_etapa, fecha_inicio, fecha_fin)
    values (nuevo_proyecto_id, 1, (proyecto_json ->> 'fechaInicio')::date, null);
    return nuevo_proyecto_id;
end;
$$;

comment on function paxinsertarproyecto(json) is 'Registra un proyecto en la base de datos';

alter function paxinsertarproyecto(json) owner to jose_sernaque;

create function paxregistrarrepuesto(repuesto_json json) returns integer
    language plpgsql
as
$$
declare
    nuevo_repuesto_id int;
begin
    if (repuesto_json ->> 'stockActual')::int < 0 then
        raise exception 'El stock actual no puede ser negativo';
    end if;
    insert into repuesto(nombre, precio, stock_disponible, stock_requerido, stock_asignado)
    values ((repuesto_json ->> 'nombre')::varchar,
            (repuesto_json ->> 'precio')::decimal,
            (repuesto_json ->> 'stockActual')::int,
            0,
            0)
    returning id_repuesto into nuevo_repuesto_id;
    return nuevo_repuesto_id;
end;
$$;

comment on function paxregistrarrepuesto(json) is 'Registra un repuesto en la base de datos';

alter function paxregistrarrepuesto(json) owner to jose_sernaque;

create function paxobtenerrepuestos() returns json
    language plpgsql
as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'precio', r.precio,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado,
            'stockActual', r.stock_disponible + r.stock_asignado,
            'linkImg', r.link_img))
    into repuestos
    from repuesto r;
    return repuestos;
end;
$$;

comment on function paxobtenerrepuestos() is 'Obtiene la lista de repuestos';

alter function paxobtenerrepuestos() owner to jose_sernaque;

create function paxobtenerproyectos() returns json
    language plpgsql
as
$$
declare
    proyectos json;
begin
    select json_agg(paobtenerproyectosporid(p.id_proyecto))
    into proyectos
    from proyecto p;
    return proyectos;
end;
$$;

comment on function paxobtenerproyectos() is 'Obtiene la lista de proyectos';

alter function paxobtenerproyectos() owner to jose_sernaque;

create function paobtenerproyectosporid(p_id_proyecto integer) returns json
    language plpgsql
as
$$
declare
    v_cliente_json            json;
    v_supervisor_json         json;
    v_jefe_json               json;
    v_repuestos_json          json;
    v_especificaciones_json   json;
    v_resultados_prueba_json  json;
    v_feedback_json           json;
    v_empleados_actuales_ids  int[];
    v_empleados_actuales_json json;
    v_proyecto_json           json;
begin
    select json_build_object(
                   'idCliente', c.id_cliente,
                   'nombre', c.nombre,
                   'ruc', c.ruc,
                   'direccion', c.direccion,
                   'telefono', c.telefono,
                   'correo', c.correo
           )
    into v_cliente_json
    from cliente c
             join proyecto p on c.id_cliente = p.id_cliente
    where p.id_proyecto = p_id_proyecto;

    select json_build_object(
                   'idEmpleado', e.id_empleado,
                   'nombre', e.nombre,
                   'apellido', e.apellido,
                   'correo', e.correo,
                   'telefono', e.telefono,
                   'direccion', e.direccion,
                   'documentoIdentidad', e.documento_identidad,
                   'tipoDocumento', e.tipo_documento,
                   'rol', e.rol,
                   'linkImg', e.link_img
           )
    into v_supervisor_json
    from empleado e
    where e.id_empleado = (select p.id_supervisor from proyecto p where p.id_proyecto = p_id_proyecto);

    select json_build_object(
                   'idEmpleado', e.id_empleado,
                   'nombre', e.nombre,
                   'apellido', e.apellido,
                   'correo', e.correo,
                   'telefono', e.telefono,
                   'direccion', e.direccion,
                   'documentoIdentidad', e.documento_identidad,
                   'tipoDocumento', e.tipo_documento,
                   'rol', e.rol,
                   'linkImg', e.link_img
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
                                 'unidades', p.unidades,
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
                                       'unidades', p.unidades,
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

    select array(select case
                            when p.id_etapa_actual = 3 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 4 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 7 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 7)
                            end
                 from proyecto p
                 where p.id_proyecto = p_id_proyecto
           )
    into v_empleados_actuales_ids;

    v_empleados_actuales_ids := array_remove(v_empleados_actuales_ids, null);

    select json_agg(
                   json_build_object(
                           'idEmpleado', e.id_empleado,
                           'nombre', e.nombre,
                           'apellido', e.apellido,
                           'correo', e.correo,
                           'telefono', e.telefono,
                           'direccion', e.direccion,
                           'documentoIdentidad', e.documento_identidad,
                           'tipoDocumento', e.tipo_documento,
                           'rol', e.rol,
                           'linkImg', e.link_img
                   )
           )
    into v_empleados_actuales_json
    from empleado e
    where e.id_empleado = any (v_empleados_actuales_ids);

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
end
$$;

comment on function paobtenerproyectosporid(integer) is 'Obtiene los proyectos por id';

alter function paobtenerproyectosporid(integer) owner to jose_sernaque;

create function pacreartipoprueba(nombre_prueba character varying) returns integer
    language plpgsql
as
$$
declare
    nuevo_tipo_prueba_id int;
begin
    insert into tipo_prueba(nombre)
    values (nombre_prueba)
    returning id_tipo_prueba into nuevo_tipo_prueba_id;
    return nuevo_tipo_prueba_id;
end;
$$;

comment on function pacreartipoprueba(varchar) is 'Crea un tipo de prueba';

alter function pacreartipoprueba(varchar) owner to jose_sernaque;

create function paxcrearparametro(parametro_json json) returns integer
    language plpgsql
as
$$
declare
    nuevo_parametro_id int;
begin
    insert into parametro(id_tipo_prueba, unidades, nombre)
    values ((parametro_json ->> 'idTipoPrueba')::int,
            (parametro_json ->> 'unidades')::varchar,
            (parametro_json ->> 'nombre')::varchar)
    returning id_parametro into nuevo_parametro_id;
    return nuevo_parametro_id;
end;
$$;

comment on function paxcrearparametro(json) is 'Crea un parametro';

alter function paxcrearparametro(json) owner to jose_sernaque;

create function paxcrearpruebaparametros(prueba_parametros_json json) returns integer
    language plpgsql
as
$$
declare
    nuevo_tipo_prueba_id int;
    repuestos_array      json[];
    repuesto_json        json;
begin
    nuevo_tipo_prueba_id := paCrearTipoPrueba((prueba_parametros_json ->> 'nombre')::varchar);
    select array(
                   select json_array_elements(prueba_parametros_json -> 'parametros')
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            repuesto_json := json_build_object(
                    'idTipoPrueba', nuevo_tipo_prueba_id,
                    'unidades', (repuestos_array[i] ->> 'unidades')::varchar,
                    'nombre', (repuestos_array[i] ->> 'nombre')::varchar);
            perform paxcrearparametro(repuesto_json);
        end loop;
    return nuevo_tipo_prueba_id;
end;
$$;

comment on function paxcrearpruebaparametros(json) is 'Crea un tipo de prueba junto a sus parametros';

alter function paxcrearpruebaparametros(json) owner to jose_sernaque;

create function paxobtenerempleadosporrol(rol_empleado character varying) returns json
    language plpgsql
as
$$
declare
    empleados json;
begin
    select json_agg(json_build_object(
            'idEmpleado', e.id_empleado,
            'usuario', e.usuario,
            'nombre', e.nombre,
            'apellido', e.apellido,
            'correo', e.correo,
            'telefono', e.telefono,
            'direccion', e.direccion,
            'documentoIdentidad', e.documento_identidad,
            'tipoDocumento', e.tipo_documento,
            'rol', e.rol))
    into empleados
    from empleado e
    where e.rol = rol_empleado;
    return empleados;
end;
$$;

comment on function paxobtenerempleadosporrol(varchar) is 'Obtiene la lista de empleados por rol';

alter function paxobtenerempleadosporrol(varchar) owner to jose_sernaque;

create function paxobtenerrepuestosrequeridos() returns json
    language plpgsql
as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado))
    into repuestos
    from repuesto r
    where r.stock_requerido < 0;
    return repuestos;
end;
$$;

comment on function paxobtenerrepuestosrequeridos() is 'Obtiene la lista de repuestos requeridos';

alter function paxobtenerrepuestosrequeridos() owner to jose_sernaque;

create function paxactualizarstock(repuesto_json json) returns integer
    language plpgsql
as
$$
declare
    repuesto_id int;
begin
    update repuesto
    set stock_disponible = stock_disponible + (repuesto_json ->> 'stockAgregado')::int,
        stock_requerido  = stock_requerido + (repuesto_json ->> 'stockAgregado')::int
    where id_repuesto = (repuesto_json ->> 'idRepuesto')::int
    returning id_repuesto into repuesto_id;
    return repuesto_id;
end;
$$;

comment on function paxactualizarstock(json) is 'Actualiza el stock de un repuesto';

alter function paxactualizarstock(json) owner to jose_sernaque;

create function paxobtenerclientesporids(ids_clientes json) returns json
    language plpgsql
as
$$
declare
    clientes json;
    ids      int[];
begin
    select array(
                   select json_array_elements_text(ids_clientes)
           )
    into ids;
    select json_agg(json_build_object(
            'idCliente', c.id_cliente,
            'nombre', c.nombre,
            'ruc', c.ruc,
            'direccion', c.direccion,
            'telefono', c.telefono,
            'correo', c.correo,
            'documentoDeIdentidad', c.documento_de_identidad,
            'tipoDeDocumentoDeIdentidad', c.tipo_de_documento_de_identidad))
    into clientes
    from cliente c
    where c.id_cliente = any (ids);
    return clientes;
end;
$$;

comment on function paxobtenerclientesporids(json) is 'Obtiene los clientes por ids';

alter function paxobtenerclientesporids(json) owner to jose_sernaque;

create function paxobtenerempleadosporids(ids_empleados json) returns json
    language plpgsql
as
$$
declare
    empleados json;
begin
    select json_agg(json_build_object(
            'idEmpleado', e.id_empleado,
            'usuario', e.usuario,
            'nombre', e.nombre,
            'apellido', e.apellido,
            'correo', e.correo,
            'telefono', e.telefono,
            'direccion', e.direccion,
            'documentoIdentidad', e.documento_identidad,
            'tipoDocumento', e.tipo_documento,
            'rol', e.rol))
    into empleados
    from empleado e
    where e.id_empleado = any ((select array(select json_array_elements_text(ids_empleados)))::int[]);
    return empleados;
end;
$$;

comment on function paxobtenerempleadosporids(json) is 'Obtiene los empleados por ids';

alter function paxobtenerempleadosporids(json) owner to jose_sernaque;

create function paxobtenerrepuestosporids(ids_repuestos json) returns json
    language plpgsql
as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado))
    into repuestos
    from repuesto r
    where r.id_repuesto = any ((select array(select json_array_elements_text(ids_repuestos)))::int[]);
    return repuestos;
end;
$$;

comment on function paxobtenerrepuestosporids(json) is 'Obtiene los repuestos por ids';

alter function paxobtenerrepuestosporids(json) owner to jose_sernaque;

create function paxobtenerrepuestosporproyecto(id_proyecto_r integer) returns json
    language plpgsql
as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado,
            'cantidad', prc.cantidad))
    into repuestos
    from repuesto r
             join proyecto_repuestos_cantidad prc on r.id_repuesto = prc.id_repuesto
    where prc.id_proyecto = id_proyecto_r;
    return repuestos;
end;
$$;

comment on function paxobtenerrepuestosporproyecto(integer) is 'Obtiene los repuestos por proyecto';

alter function paxobtenerrepuestosporproyecto(integer) owner to jose_sernaque;

create function paxagregarrepuestosrequeridos(repuestos_requeridos json) returns void
    language plpgsql
as
$$
declare
    repuestos_array json[];
begin
    select array(
                   select json_array_elements(repuestos_requeridos)
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            if (repuestos_array[i] ->> 'stockRequerido')::int < 0 then
                raise exception 'El stock requerido no puede ser negativo';
            end if;
            update repuesto
            set stock_requerido = stock_requerido - (repuestos_array[i] ->> 'stockRequerido')::int
            where id_repuesto = (repuestos_array[i] ->> 'idRepuesto')::int;
        end loop;
end;
$$;

comment on function paxagregarrepuestosrequeridos(json) is 'Agrega repuestos requeridos';

alter function paxagregarrepuestosrequeridos(json) owner to jose_sernaque;

create function paxasignarrepuestosaproyecto(repuestos_asignados json) returns void
    language plpgsql
as
$$
declare
    repuestos_array json[];
begin
    select array(
                   select json_array_elements(repuestos_asignados)
           )
    into repuestos_array;
    for i in 1..array_length(repuestos_array, 1)
        loop
            if (repuestos_array[i] ->> 'stockAsignado')::int < 0 then
                raise exception 'El stock asignado no puede ser negativo';
            end if;
            update repuesto
            set stock_asignado   = stock_asignado + (repuestos_array[i] ->> 'stockAsignado')::int,
                stock_disponible = stock_disponible - (repuestos_array[i] ->> 'stockAsignado')::int
            where id_repuesto = (repuestos_array[i] ->> 'idRepuesto')::int;
        end loop;
    -- deberia cambiar de etapa?
end;
$$;

comment on function paxasignarrepuestosaproyecto(json) is 'Asigna repuestos a un proyecto';

alter function paxasignarrepuestosaproyecto(json) owner to jose_sernaque;

create function paxobtenerproyectoporjefe(id_jefe_p integer) returns json
    language plpgsql
as
$$
declare
begin
    return (select json_agg(paobtenerproyectosporid(p.id_proyecto))
            from proyecto p
            where p.id_jefe = id_jefe_p);
end;
$$;

comment on function paxobtenerproyectoporjefe(integer) is 'Obtiene los proyectos por jefe';

alter function paxobtenerproyectoporjefe(integer) owner to jose_sernaque;

create function paxobteneretapaporid(id_etapa_p integer) returns json
    language plpgsql
as
$$
declare
    etapa json;
begin
    select json_build_object(
                   'idEtapa', e.id_etapa,
                   'nombre', e.nombre
           )
    into etapa
    from etapa e
    where e.id_etapa = id_etapa_p;
    return etapa;
end;
$$;

comment on function paxobteneretapaporid(integer) is 'Obtiene la etapa por id';

alter function paxobteneretapaporid(integer) owner to jose_sernaque;

create function paxobtenerrepuestosfaltantesporjefe(id_jefe_p integer) returns json
    language plpgsql
as
$$
declare
    repuestos json;
begin
    select json_agg(json_build_object(
            'idRepuesto', r.id_repuesto,
            'nombre', r.nombre,
            'descripcion', r.descripcion,
            'precio', r.precio,
            'linkImg', r.link_img,
            'stockDisponible', r.stock_disponible,
            'stockRequerido', r.stock_requerido,
            'stockAsignado', r.stock_asignado,
            'cantidad', prc.cantidad))
    into repuestos
    from repuesto r
             join proyecto_repuestos_cantidad prc on r.id_repuesto = prc.id_repuesto
             join proyecto p on prc.id_proyecto = p.id_proyecto
    where p.id_jefe = id_jefe_p
      and r.stock_requerido < 0
    group by r.id_repuesto;
    return repuestos;
end;
$$;

comment on function paxobtenerrepuestosfaltantesporjefe(integer) is 'Obtiene los repuestos faltantes de los proyectos de un jefe';

alter function paxobtenerrepuestosfaltantesporjefe(integer) owner to jose_sernaque;

create function paobtenertecnicosdisponibles() returns json
    language plpgsql
as
$$
declare
    tecnicos_ids int[];
    tecnicos     json;
begin
    select array(select case
                            when p.id_etapa_actual = 3 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 4 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 7 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 7)
                            end
                 from proyecto p)
    into tecnicos_ids;

    tecnicos_ids := array_remove(tecnicos_ids, null);

    select json_agg(json_build_object(
            'idEmpleado', e.id_empleado,
            'nombre', e.nombre,
            'apellido', e.apellido,
            'correo', e.correo,
            'telefono', e.telefono,
            'direccion', e.direccion,
            'documentoIdentidad', e.documento_identidad,
            'tipoDocumento', e.tipo_documento,
            'rol', e.rol,
            'linkImg', e.link_img))
    into tecnicos
    from empleado e
    where e.rol = 'tecnico'
      and e.id_empleado != all (tecnicos_ids);

    raise notice '%', tecnicos;

    return tecnicos;
end;
$$;

comment on function paobtenertecnicosdisponibles() is 'Obtiene los técnicos disponibles';

alter function paobtenertecnicosdisponibles() owner to jose_sernaque;

create function paasignarempleadosaproyecto(p_idproyecto integer, p_idempleados integer[], p_fechaasignacion date) returns void
    language plpgsql
as
$$
declare
    v_tecnicos_ocupados int[];
    v_id_etapa_prev     int;
    v_id_etapa_next     int;
begin
    select array(select case
                            when p.id_etapa_actual = 3 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 4 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 3)
                            when p.id_etapa_actual = 7 then (select pee2.id_tecnico
                                                             from proyecto_etapa_empleado pee2
                                                             where pee2.id_proyecto = p.id_proyecto
                                                               and pee2.id_etapa = 7)
                            end
                 from proyecto p)
    into v_tecnicos_ocupados;
    v_tecnicos_ocupados := array_remove(v_tecnicos_ocupados, null);

    IF array_length(p_idEmpleados, 1) IS NULL THEN
        RAISE EXCEPTION 'La lista de empleados no puede estar vacía.';
    END IF;
    IF p_idEmpleados && v_tecnicos_ocupados THEN
        RAISE EXCEPTION 'No se puede asignar a un técnico que no está disponible';
    END IF;

    select p.id_etapa_actual into v_id_etapa_prev from proyecto p where p.id_proyecto = p_idProyecto;
    v_id_etapa_next := v_id_etapa_prev + 1;

    for i in 1..array_length(p_idEmpleados, 1)
        loop
            INSERT INTO proyecto_etapa_empleado (id_proyecto, id_etapa, id_tecnico)
            VALUES (p_idProyecto, v_id_etapa_next, p_idEmpleados[i]);
        end loop;
    if v_id_etapa_prev = 2 then
        perform paCambiarEtapaProyecto(p_idProyecto, v_id_etapa_next, p_fechaAsignacion);
    else
        if v_id_etapa_prev = 6 then
            perform paCambiarEtapaProyecto(p_idProyecto, v_id_etapa_next, p_fechaAsignacion);
        end if;
    end if;
end;
$$;

comment on function paasignarempleadosaproyecto(integer, integer[], date) is 'Asigna empleados a un proyecto';

alter function paasignarempleadosaproyecto(integer, integer[], date) owner to jose_sernaque;

create function pacambiaretapaproyecto(p_id_proyecto integer, p_id_etapa integer, p_fecha_inicio date) returns void
    language plpgsql
as
$$
declare
    v_id_etapa_prev int;
begin
    select pec.id_etapa
    into v_id_etapa_prev
    from proyecto_etapas_cambio pec
    where pec.id_proyecto = p_id_proyecto
      and pec.fecha_fin is null;
    update proyecto_etapas_cambio pec
    set fecha_fin = p_fecha_inicio
    where pec.id_proyecto = p_id_proyecto
      and pec.id_etapa = v_id_etapa_prev;
    insert into proyecto_etapas_cambio (id_proyecto, id_etapa, fecha_inicio)
    values (p_id_proyecto, p_id_etapa, p_fecha_inicio);
    update proyecto
    set id_etapa_actual = p_id_etapa
    where id_proyecto = p_id_proyecto;
end;
$$;

comment on function pacambiaretapaproyecto(integer, integer, date) is 'Cambia la etapa de un proyecto';

alter function pacambiaretapaproyecto(integer, integer, date) owner to jose_sernaque;

create function paregistrarfeedback(p_feedback_json json) returns integer
    language plpgsql
as
$$
declare
    v_resultados                     json;
    v_resultado_prueba_supervisor_id int;
    v_feedback_id                    int;
    v_etapa_previa                   int;
begin
    select json_build_object(
                   'idProyecto', (p_feedback_json ->> 'idProyecto')::integer,
                   'idEmpleado', (p_feedback_json ->> 'idEmpleado')::integer,
                   'fecha', (p_feedback_json ->> 'fecha')::date,
                   'resultados', p_feedback_json -> 'resultados'
           )
    into v_resultados;
    select * into v_resultado_prueba_supervisor_id from paRegistrarResultados(v_resultados);
    insert into feedback (id_resultado_prueba_tecnico, id_resultado_prueba_supervisor, aprobado, comentario)
    values ((p_feedback_json ->> 'idResultadoPruebaTecnico')::integer,
            v_resultado_prueba_supervisor_id,
            (p_feedback_json ->> 'aprobado')::boolean,
            p_feedback_json ->> 'comentario')
    returning id_feedback into v_feedback_id;
    select p.id_etapa_actual
    into v_etapa_previa
    from proyecto p
    where p.id_proyecto = (p_feedback_json ->> 'idProyecto')::integer;
    if v_etapa_previa = 4 and (p_feedback_json ->> 'aprobado')::boolean then
        perform paCambiarEtapaProyecto(
                (p_feedback_json ->> 'idProyecto')::integer,
                5,
                (p_feedback_json ->> 'fecha')::date
                );
    elsif v_etapa_previa = 4 and not (p_feedback_json ->> 'aprobado')::boolean then
        perform paCambiarEtapaProyecto(
                (p_feedback_json ->> 'idProyecto')::integer,
                3,
                (p_feedback_json ->> 'fecha')::date
                );
    end if;
    return v_feedback_id;
end;

$$;

alter function paregistrarfeedback(json) owner to jose_sernaque;

create function paobtenerempleadosporids(p_ids_empleado integer[])
    returns TABLE(id_empleado integer, password character varying, nombre character varying, apellido character varying, correo character varying, telefono character varying, direccion character varying, tipo_documento character varying, documento_identidad character varying, rol character varying, link_img character varying)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT
        e.id_empleado,
        e.password,
        e.nombre,
        e.apellido,
        e.correo,
        e.telefono,
        e.direccion,
        e.tipo_documento,
        e.documento_identidad,
        e.rol,
        e.link_img
    FROM empleado e
    WHERE e.id_empleado = ANY (p_ids_empleado);
END;
$$;

alter function paobtenerempleadosporids(integer[]) owner to jose_sernaque;

create function paobtenerempleadosporrol(p_rol character varying)
    returns TABLE(id_empleado integer, password character varying, nombre character varying, apellido character varying, correo character varying, telefono character varying, direccion character varying, tipo_documento character varying, documento_identidad character varying, rol character varying, link_img character varying)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
        SELECT e.id_empleado,
               e.password,
               e.nombre,
               e.apellido,
               e.correo,
               e.telefono,
               e.direccion,
               e.tipo_documento,
               e.documento_identidad,
               e.rol,
               e.link_img
        FROM empleado e
        WHERE e.rol = p_rol;
END;
$$;

alter function paobtenerempleadosporrol(varchar) owner to jose_sernaque;

create procedure pacrearcliente(IN p_nombre character varying, IN p_ruc character varying, IN p_direccion character varying, IN p_telefono character varying, IN p_correo character varying)
    language plpgsql
as
$$
BEGIN
    INSERT INTO Cliente (Nombre,
                         RUC,
                         Direccion,
                         Telefono,
                         Correo)
    VALUES (p_Nombre,
            p_RUC,
            p_Direccion,
            p_Telefono,
            p_Correo);
END;
$$;

alter procedure pacrearcliente(varchar, varchar, varchar, varchar, varchar) owner to jose_sernaque;

create function paobtenerclientes()
    returns TABLE(id_cliente integer, nombre character varying, ruc character varying, direccion character varying, telefono character varying, correo character varying)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY SELECT * FROM Cliente;
END;
$$;

alter function paobtenerclientes() owner to jose_sernaque;

create function paobtenerclientesporids(p_ids_cliente integer[])
    returns TABLE(id_cliente integer, nombre character varying, ruc character varying, direccion character varying, telefono character varying, correo character varying)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT
        c.id_cliente,
        c.nombre,
        c.ruc,
        c.direccion,
        c.telefono,
        c.correo
    FROM cliente c
    WHERE c.id_cliente = ANY (p_ids_cliente);
END;
$$;

alter function paobtenerclientesporids(integer[]) owner to jose_sernaque;

create function paxobtenerproyectoporsupervisor(id_supervisor_p integer) returns json
    language plpgsql
as
$$
declare
begin
    return (select json_agg(paobtenerproyectosporid(p.id_proyecto))
            from proyecto p
            where p.id_supervisor = id_supervisor_p);
end;
$$;

alter function paxobtenerproyectoporsupervisor(integer) owner to jose_sernaque;

create function paobtenerhistorialproyecto(p_id_proyecto integer) returns json
    language plpgsql
as
$$
declare
    v_etapas_empleados_json json;
    v_etapas_cambios_json   json;
    v_historial_json        json;
begin
    -- Obtener las etapas y empleados asignados
    select json_agg(
               json_build_object(
                   'idEtapa', e.id_etapa,
                   'nombreEtapa', e.nombre,
                   'empleados', (
                       select json_agg(
                           json_build_object(
                               'idEmpleado', em.id_empleado,
                               'nombre', em.nombre,
                               'apellido', em.apellido,
                               'correo', em.correo,
                               'telefono', em.telefono,
                               'tipoDocumento', em.tipo_documento,
                               'documentoIdentidad', em.documento_identidad,
                               'rol', em.rol,
                               'linkImg', em.link_img
                           )
                       )
                       from proyecto_etapa_empleado pee
                                join empleado em on pee.id_tecnico = em.id_empleado
                       where pee.id_proyecto = p_id_proyecto
                         and pee.id_etapa = e.id_etapa
                   )
               )
           )
    into v_etapas_empleados_json
    from etapa e
    where e.id_etapa in (
        select distinct pee.id_etapa
        from proyecto_etapa_empleado pee
        where pee.id_proyecto = p_id_proyecto
    );

    -- Obtener los cambios en las etapas
    select json_agg(
               json_build_object(
                   'idEtapaCambio', pec.id_proyecto_etapas_cambio,
                   'idEtapa', pec.id_etapa,
                   'nombreEtapa', e.nombre,
                   'fechaInicio', pec.fecha_inicio,
                   'fechaFin', pec.fecha_fin
               )
           )
    into v_etapas_cambios_json
    from proyecto_etapas_cambio pec
             join etapa e on pec.id_etapa = e.id_etapa
    where pec.id_proyecto = p_id_proyecto;

    -- Construir el historial del proyecto
    select json_build_object(
               'idProyecto', p_id_proyecto,
               'etapasEmpleados', v_etapas_empleados_json,
               'etapasCambios', v_etapas_cambios_json
           )
    into v_historial_json;

    return v_historial_json;
end;
$$;

comment on function paobtenerhistorialproyecto(integer) is 'Obtiene el historial del proyecto por ID, incluyendo asignaciones de empleados y cambios de etapas';

alter function paobtenerhistorialproyecto(integer) owner to jose_sernaque;

create function pavalidarcorreo(p_correo character varying) returns json
    language plpgsql
as
$$
declare
    v_empleado json;
begin
    -- Intentar obtener el empleado con el correo proporcionado
    select json_build_object(
               'idEmpleado', e.id_empleado,
               'password', e.password,
               'nombre', e.nombre,
               'apellido', e.apellido,
               'correo', e.correo,
               'telefono', e.telefono,
               'direccion', e.direccion,
               'tipoDocumento', e.tipo_documento,
               'documentoIdentidad', e.documento_identidad,
               'rol', e.rol,
               'linkImg', e.link_img
           )
    into v_empleado
    from empleado e
    where e.correo = p_correo;

    -- Si no se encuentra el empleado, retornar NULL
    if v_empleado is null then
        raise exception 'Usuario no encontrado';
    end if;

    return v_empleado;
end;
$$;

comment on function pavalidarcorreo(varchar) is 'Obtiene la información del empleado por correo';

alter function pavalidarcorreo(varchar) owner to jose_sernaque;

