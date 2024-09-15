package dev.vmillet.chatterbox.controllers

import dev.vmillet.chatterbox.models.responses.MessageResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("recipe")
class RecipeController {
    @GetMapping
    fun recipe(): ResponseEntity<MessageResponse> {
        return ResponseEntity.ok(MessageResponse("My secret recipe"))
    }
}