package dev.vmillet.chatterbox.services

import dev.vmillet.chatterbox.entities.User
import dev.vmillet.chatterbox.models.requests.LoginRequest
import dev.vmillet.chatterbox.models.requests.RegisterRequest
import dev.vmillet.chatterbox.models.responses.JwtAuthResponse
import dev.vmillet.chatterbox.models.requests.RefreshTokenRequest
import dev.vmillet.chatterbox.repositories.UserRepository
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service


@Service
class AuthService(
    private val userRepository: UserRepository,
    private val authenticationManager: AuthenticationManager,
    private val jwtUtilService: JwtUtilService,
    private val userDetailsService: UserDetailsService,
    private val passwordEncoder: PasswordEncoder,
    private val refreshTokenService: RefreshTokenService
) {
    fun registerUser(registerDto: RegisterRequest) {
        require(userRepository.findByUsername(registerDto.username) == null) {
            "Username already exists"
        }

        require(userRepository.findByEmail(registerDto.email) == null) {
            "Email already exists"
        }

        val user = User(
            username = registerDto.username,
            email = registerDto.email,
            password = passwordEncoder.encode(registerDto.password)
        )

        userRepository.save(user)
    }

    fun login(loginDto: LoginRequest): ResponseEntity<JwtAuthResponse> {
        val authentication: Authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginDto.usernameOrEmail, loginDto.password)
        )

        if (authentication.isAuthenticated) {
            val userDetails = userDetailsService.loadUserByUsername(loginDto.usernameOrEmail)
            val token = jwtUtilService.generateToken(userDetails.username)
            val refreshToken = refreshTokenService.createRefreshToken(loginDto.usernameOrEmail)

            return ResponseEntity.ok(JwtAuthResponse(token, refreshToken.token))
        } else {
            throw Error("Username or email not found")
        }
    }

    fun getRefreshToken(refreshTokenRequest: RefreshTokenRequest):  JwtAuthResponse {
        val refreshToken = refreshTokenService.findByToken(refreshTokenRequest.token)
            ?: throw Error("Refresh token not found")

        if (refreshTokenService.verifyExpiration(refreshToken)) {
            val accessToken: String = jwtUtilService.generateToken(refreshToken.user.username)
            return JwtAuthResponse(accessToken, refreshToken.token)
        } else {
            throw Error("Refresh token is not expired")
        }
    }

    fun logout(refreshTokenRequest: RefreshTokenRequest): ResponseEntity<*> {
        val result = refreshTokenService.logout(refreshTokenRequest.token)
        if (result < 1) {
            throw Error("Refresh token expired")
        }
        return ResponseEntity.ok("")
    }
}