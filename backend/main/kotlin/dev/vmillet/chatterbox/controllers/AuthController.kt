package dev.vmillet.chatterbox.controllers

import dev.vmillet.chatterbox.models.requests.LoginRequest
import dev.vmillet.chatterbox.models.requests.RegisterRequest
import dev.vmillet.chatterbox.models.ResponseMessage
import dev.vmillet.chatterbox.models.responses.RegisterResponse
import dev.vmillet.chatterbox.services.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("register")
    fun register(@RequestBody registerRequest: RegisterRequest): ResponseEntity<RegisterResponse> {
        val user = authService.registerUser(registerRequest)
        val response = RegisterResponse(
            message = "User registered successfully"
        )
        return ResponseEntity.ok(response)
    }

    @PostMapping("login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<ResponseMessage> {
        return ResponseEntity.ok(ResponseMessage("register"))
    }
}