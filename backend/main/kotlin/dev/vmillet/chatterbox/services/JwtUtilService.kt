package dev.vmillet.chatterbox.services

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.MacAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey


@Service
class JwtUtilService(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.acces-token-expiration}") private val accessToken: Int
){
    val algo: MacAlgorithm = Jwts.SIG.HS512

    fun generateToken(username: String): String {
        return Jwts
            .builder()
            .subject(username)
            .issuedAt(Date())
            .expiration(Date(Date().time + accessToken))
            .signWith(getSignKey(), algo)
            .compact()
    }

    fun validateToken(token: String): Boolean {
        return !isTokenExpired(token)
    }

    fun extractUsername(token: String): String? {
        return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token).payload.subject
    }

    private fun isTokenExpired(token: String): Boolean {
        val expiration = getExpirationDateFromToken(token)
        return expiration.before(Date())
    }

    private fun getExpirationDateFromToken(token: String): Date {
        return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token).payload.expiration
    }

    private fun getSignKey(): SecretKey {
        val keyBytes = Decoders.BASE64.decode(secret)
        return Keys.hmacShaKeyFor(keyBytes)
    }
}