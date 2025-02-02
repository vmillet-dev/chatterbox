package dev.vmillet.chatterbox.models.requests

data class RegisterRequest(
    val email: String,
    val username: String,
    val password: String
)