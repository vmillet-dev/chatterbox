plugins {
	alias(libs.plugins.springboot.framework)
	alias(libs.plugins.springboot.dep.management)
	alias(libs.plugins.kotlin.jvm)
	alias(libs.plugins.kotlin.spring)
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
	implementation(libs.springboot.tomcat)
	implementation(libs.spring.autoconfigure)
	implementation(libs.spring.datajpa)
	implementation(libs.spring.webmvc)
	implementation(libs.spring.websocket)
	implementation(libs.spring.messaging)
	implementation(libs.fasterxml.jackson)
	implementation(libs.kotlin.reflect)
	implementation(libs.jakarta.persistence)
	implementation(libs.hibernate.core)
	runtimeOnly(libs.postgresql)

	testImplementation(libs.springboot.test)
	testImplementation(libs.springboot.jdbc)
	testImplementation(libs.kotlin.test)
	testImplementation(libs.h2.database)
	testRuntimeOnly(libs.junit.plateform.launcher)
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
