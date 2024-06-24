package dev.vmillet.chatterbox.services

import dev.vmillet.chatterbox.models.requests.RegisterRequest
import dev.vmillet.chatterbox.entities.User
import dev.vmillet.chatterbox.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository
) {
    fun registerUser(registerDto: RegisterRequest): User {
        // Check if username or email already exists
        if (userRepository.findByUsername(registerDto.username) != null) {
            throw IllegalArgumentException("Username already exists")
        }
        if (userRepository.findByEmail(registerDto.email) != null) {
            throw IllegalArgumentException("Email already exists")
        }

        // Create new user
        val user = User(
            username = registerDto.username,
            email = registerDto.email,
            password = registerDto.password
        )

        // Save user to database
        return userRepository.save(user)
    }
}