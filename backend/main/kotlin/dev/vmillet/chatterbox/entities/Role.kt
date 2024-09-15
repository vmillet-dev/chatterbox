package dev.vmillet.chatterbox.entities

import jakarta.persistence.*


@Entity
@Table(name = "t_role")
class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    val name: RoleEnum
)