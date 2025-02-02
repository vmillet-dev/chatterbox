package dev.vmillet.chatterbox.services

import dev.vmillet.chatterbox.entities.RefreshToken
import dev.vmillet.chatterbox.entities.User
import dev.vmillet.chatterbox.repositories.RefreshTokenRepository
import dev.vmillet.chatterbox.repositories.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID


@Service
class RefreshTokenService(
    @Value("\${app.jwt.refresh-token-expiration}") private val refreshToken: Long,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val userRepository: UserRepository
) {

    fun createRefreshToken(username: String): RefreshToken {
        val user: User = userRepository.findByUsername(username) ?: throw UsernameNotFoundException("User $username not found")

        val refreshToken = RefreshToken(
            user= user,
            token= UUID.randomUUID().toString(),
            expiryDate = Instant.now().plusMillis(refreshToken)
        )
        return refreshTokenRepository.save(refreshToken)
    }


    fun findByToken(token: String): RefreshToken? {
        return refreshTokenRepository.findByToken(token)
    }

    fun verifyExpiration(token: RefreshToken?): Boolean {
        return token != null && Instant.now().isAfter(token.expiryDate)
    }

    fun logout(token: String): Int {
        return refreshTokenRepository.deleteByToken(token)
    }
}