plugins {
	id("org.springframework.boot") version "3.3.1"
	id("io.spring.dependency-management") version "1.1.5"
	kotlin("jvm") version "2.0.0"
	kotlin("plugin.spring") version "2.0.0"
}

group = "dev.vmillet"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	runtimeOnly("org.postgresql:postgresql:42.7.3")

	implementation("org.springframework.boot:spring-boot-starter-web:3.3.1")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.3.1")
	implementation("org.springframework.boot:spring-boot-starter-security:3.3.1")

	implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.17.1")
	implementation("org.jetbrains.kotlin:kotlin-reflect:2.0.0")

	testImplementation("org.springframework.boot:spring-boot-starter-test:6.1.10")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5:2.0.0")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher:1.10.2")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict", "-Xmx1G")
	}
}

sourceSets {
	main {
		java.srcDirs("backend/main/kotlin")
		resources.srcDirs("backend/main/resources")
	}

	test {
		java.srcDirs("backend/test/kotlin")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
