# Build stage
FROM maven:3.9.3-amazoncorretto-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#Runtime stage
FROM amazoncorretto:17
ARG DEV_PROFILE=dev
ARG PROD_PROFILE=dev
ARG APP_VERSION=1.0.0
WORKDIR /app
COPY --from=build /build/target/Book-*.jar /app/
EXPOSE 8090

ENV DB_URL=jdbc:postgresql://postgres:5432/bsn
ENV ACTIVE_PROFILE=${DEV_PROFILE}
ENV JAR_VERSION=${APP_VERSION}
CMD ["ls", "/app"]
CMD ["java", "-Dspring.profiles.active=${ACTIVE_PROFILE}", "-Dspring.datasource.url=${DB_URL}", "-jar", "Book-Social-Network-1.0.0.jar"]
