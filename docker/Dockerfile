FROM openjdk:21-slim

# Create a non-root user
RUN addgroup --system webapp && adduser --system --ingroup webapp webapp

WORKDIR /app

COPY build/libs/ChatterBox-0.0.1-SNAPSHOT.jar app.jar

# Change ownership of the jar file
RUN chown webapp:webapp app.jar

USER webapp

EXPOSE 80

CMD ["java", "-jar", "app.jar"]