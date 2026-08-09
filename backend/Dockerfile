# Stage 1: Build application with Maven and Java 21
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (leveraging layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime environment using Java 21 JRE
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/target/securelens-backend-1.0.0.jar app.jar

# Expose backend port
EXPOSE 8090

# Set entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]
