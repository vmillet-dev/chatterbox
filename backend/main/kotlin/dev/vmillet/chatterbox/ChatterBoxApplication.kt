package dev.vmillet.chatterbox

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories(basePackages = ["dev.vmillet.chatterbox.repositories"])
class ChatterBoxApplication

fun main(args: Array<String>) {
	runApplication<ChatterBoxApplication>(*args)
}
