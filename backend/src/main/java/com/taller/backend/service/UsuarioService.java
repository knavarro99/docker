package com.taller.backend.service;

import com.taller.backend.dto.LoginResponse;

/**
 * Interfaz del servicio de usuarios.
 * Permite desacoplar la logica de negocio de su implementacion (inyeccion de dependencias).
 */
public interface UsuarioService {

    /**
     * Verifica si el usuario existe y valida sus credenciales.
     *
     * @param usuario nombre de usuario
     * @param clave   clave del usuario
     * @return LoginResponse con el resultado de la verificacion
     */
    LoginResponse login(String usuario, String clave);
}
