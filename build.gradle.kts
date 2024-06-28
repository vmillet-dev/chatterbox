plugins {
	alias(libs.plugins.kotlin.jvm)
	alias(libs.plugins.kotlin.spring)
	alias(libs.plugins.springboot.framework)
	alias(libs.plugins.spring.dep.management)
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
	implementation(libs.spring.autoconfigure)
	implementation(libs.spring.web)
	implementation(libs.spring.webmvc)
	implementation(libs.spring.websocket)
	implementation(libs.spring.data.jpa)
	implementation(libs.fasterxml.jackson)
	implementation(libs.postgresql)
	implementation(libs.kotlin.reflect)
	implementation(libs.hibernate)
	implementation(libs.jakarta.persistence)

	testImplementation(libs.springboot.test)
	testImplementation(libs.springboot.jdbc)
	testImplementation(libs.kotlin.test)
	testImplementation(libs.h2)
	testRuntimeOnly(libs.junit.launcher)
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

sourceSets {
	main {
		java.srcDirs("backend/main/kotlin")
		resources.srcDirs("backend/main/resources")
	}

	test {
		java.srcDirs("backend/test/kotlin")
		resources.srcDirs("backend/test/resources")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
	systemProperty("spring.profiles.active", "test")
}
