# Multi-stage build for Spring Boot application

# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /app

# Copy Maven files for dependency caching
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application (skip tests for faster build)
# Set Maven memory options to prevent OOM during build
ENV MAVEN_OPTS="-Xmx512m -XX:MaxMetaspaceSize=256m"
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8082/api/specialties || exit 1

# Run application with memory constraints for Render free tier (512MB RAM)
# -Xms: Initial heap size (128MB)
# -Xmx: Maximum heap size (384MB - leave ~128MB for non-heap memory)
# -XX:MaxMetaspaceSize: Limit metaspace to 128MB
# -XX:+UseSerialGC: Use Serial GC (lower memory footprint)
ENTRYPOINT ["java", \
    "-Xms128m", \
    "-Xmx384m", \
    "-XX:MaxMetaspaceSize=128m", \
    "-XX:+UseSerialGC", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
