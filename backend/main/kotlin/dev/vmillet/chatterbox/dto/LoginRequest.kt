package dev.vmillet.chatterbox.dto

data class LoginRequest(
    val usernameOrEmail: String,
    val password: String
)