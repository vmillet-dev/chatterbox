package dev.vmillet.chatterbox.services

import dev.vmillet.chatterbox.entities.User
import dev.vmillet.chatterbox.models.JwtUserDetails
import dev.vmillet.chatterbox.repositories.UserRepository
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class JwtUserDetailsService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(email: String): JwtUserDetails {
        val user: User = userRepository.findByEmail(email) ?: throw UsernameNotFoundException("User not found")
        return JwtUserDetails.build(user)
    }
}