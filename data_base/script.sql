-- Crear tabla unidad
CREATE TABLE unidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

-- Crear tabla tipo_movimiento
CREATE TABLE tipo_movimiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

-- Crear tabla producto
CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    id_unidad BIGINT NOT NULL,
    precio_compra NUMERIC(10,2) NOT NULL,
    precio_venta NUMERIC(10,2) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad NUMERIC(10,3) NOT NULL
);

-- Crear tabla movimiento
CREATE TABLE movimiento (
    id SERIAL PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    id_tipo BIGINT NOT NULL,
    cantidad NUMERIC(10,3) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    fecha DATE NOT NULL
);

-- Crear tabla venta
CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    cantidad NUMERIC(10,3) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    fecha DATE NOT NULL
);

-- Crear tabla detalle_venta
CREATE TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    id_venta BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad NUMERIC(10,3) NOT NULL,
    valor NUMERIC(10,2) NOT NULL
);

-- Agregar claves foráneas
ALTER TABLE producto ADD CONSTRAINT fk_producto_unidad FOREIGN KEY (id_unidad) REFERENCES unidad(id);
ALTER TABLE movimiento ADD CONSTRAINT fk_movimiento_producto FOREIGN KEY (id_producto) REFERENCES producto(id);
ALTER TABLE movimiento ADD CONSTRAINT fk_movimiento_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_movimiento(id);
ALTER TABLE detalle_venta ADD CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (id_venta) REFERENCES venta(id);
ALTER TABLE detalle_venta ADD CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES producto(id);
