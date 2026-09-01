package com.taller.backend.dto;

public record LoginResponse(boolean existe, boolean autenticado, String mensaje) {
}
