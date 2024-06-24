package dev.vmillet.chatterbox.models

data class ChatMessage(
    val content: String,
    val sender: String,
    val timestamp: Long = System.currentTimeMillis()
)