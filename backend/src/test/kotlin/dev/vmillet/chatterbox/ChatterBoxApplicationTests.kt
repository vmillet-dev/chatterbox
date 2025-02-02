package dev.vmillet.chatterbox

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration

@SpringBootTest
@ContextConfiguration(classes = [ChatterBoxApplicationTests::class])
@ActiveProfiles("test")
class ChatterBoxApplicationTests {

	@Test
	fun contextLoads() {
	}

}
