#
# Build stage
#
FROM --platform=$BUILDPLATFORM maven:3.8.7-amazoncorretto-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

#
# Package stage
#
FROM --platform=$TARGETPLATFORM mcr.microsoft.com/openjdk/jdk:17-distroless
COPY --from=build /home/app/target /home/app
CMD ["-jar","/home/app/event-reactivator-1.0.jar"]