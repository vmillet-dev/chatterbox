package dev.vmillet.chatterbox.controllers

import dev.vmillet.chatterbox.models.ChatMessage
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller


@Controller
class MessageController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    fun sendMessage(chatMessage: ChatMessage): ChatMessage {
        return chatMessage
    }
}