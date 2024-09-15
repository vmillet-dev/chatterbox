package dev.vmillet.chatterbox.models.responses

data class JwtAuthResponse(val token: String, val refreshToken: String)