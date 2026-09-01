package com.taller.backend.service.impl;

import com.taller.backend.dto.LoginResponse;
import com.taller.backend.model.Usuario;
import com.taller.backend.repository.UsuarioRepository;
import com.taller.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public LoginResponse login(String usuario, String clave) {
        Optional<Usuario> encontrado = usuarioRepository.findByUsuario(usuario);

        if (encontrado.isEmpty()) {
            return new LoginResponse(false, false, "El usuario '" + usuario + "' no existe");
        }

        Usuario u = encontrado.get();

        if (!u.getClave().equals(clave)) {
            return new LoginResponse(true, false, "El usuario existe, pero la clave es incorrecta");
        }

        return new LoginResponse(true, true, "Bienvenido, " + u.getUsuario());
    }
}
