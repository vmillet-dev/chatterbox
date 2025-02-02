package dev.vmillet.chatterbox.controllers

import dev.vmillet.chatterbox.models.requests.LoginRequest
import dev.vmillet.chatterbox.models.requests.RegisterRequest
import dev.vmillet.chatterbox.models.responses.JwtAuthResponse
import dev.vmillet.chatterbox.models.requests.RefreshTokenRequest
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
        authService.registerUser(registerRequest)
        val response = RegisterResponse(
            message = "User registered successfully"
        )
        return ResponseEntity.ok(response)
    }

    @PostMapping("login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<JwtAuthResponse> {
        return authService.login(loginRequest)
    }

    @PostMapping("/refreshToken")
    fun refreshToken(@RequestBody refreshTokenRequest: RefreshTokenRequest): JwtAuthResponse {
        return authService.getRefreshToken(refreshTokenRequest)
    }

    @PostMapping("/signout")
    fun logoutUser(@RequestBody refreshTokenRequest: RefreshTokenRequest): ResponseEntity<*> {
        return authService.logout(refreshTokenRequest)
    }
}