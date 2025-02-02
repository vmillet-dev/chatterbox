package dev.vmillet.chatterbox.models.responses

import java.time.Instant

data class ErrorResponse(
    val errorCode: Int,
    val message: String,
    val timestamp: Instant = Instant.now()
)