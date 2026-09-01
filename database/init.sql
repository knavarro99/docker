-- Inicializacion de la base de datos del Taller I
-- Este script se ejecuta automaticamente al crear el contenedor MySQL

CREATE DATABASE IF NOT EXISTS tallerdb;
USE tallerdb;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Activo'
);

-- Usuario administrador requerido por el taller
INSERT INTO usuario (usuario, clave, status)
VALUES ('Admin', 'Pass_987', 'Activo')
ON DUPLICATE KEY UPDATE usuario = usuario;
