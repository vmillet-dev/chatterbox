package dev.vmillet.chatterbox.repositories

import dev.vmillet.chatterbox.entities.Role
import dev.vmillet.chatterbox.entities.RoleEnum
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface RoleRepository : JpaRepository<Role?, Long?> {
    fun findByName(name: RoleEnum?): Role?
}