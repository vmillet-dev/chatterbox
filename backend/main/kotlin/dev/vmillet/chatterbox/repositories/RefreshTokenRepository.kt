package dev.vmillet.chatterbox.repositories

import dev.vmillet.chatterbox.entities.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository


@Repository
interface RefreshTokenRepository : JpaRepository<RefreshToken?, Long?> {
    fun findByToken(token: String): RefreshToken?

    @Modifying
    fun deleteByToken(token: String?): Int
}