package dev.vmillet.chatterbox.controllers

import dev.vmillet.chatterbox.dto.LoginRequest
import dev.vmillet.chatterbox.dto.RegisterRequest
import dev.vmillet.chatterbox.dto.ResponseMessage
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("auth")
class AuthController {

    @PostMapping("register")
    fun register(@RequestBody registerRequest: RegisterRequest): ResponseEntity<ResponseMessage> {
        return ResponseEntity.ok(ResponseMessage("register"))
    }

    @PostMapping("login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<ResponseMessage> {
        return ResponseEntity.ok(ResponseMessage("register"))
    }
}