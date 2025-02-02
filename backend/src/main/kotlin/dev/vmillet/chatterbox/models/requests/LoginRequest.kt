package dev.vmillet.chatterbox.models.requests

data class LoginRequest(
    val usernameOrEmail: String,
    val password: String
)