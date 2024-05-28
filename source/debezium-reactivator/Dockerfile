#
# Build stage
#
FROM --platform=$BUILDPLATFORM maven:3.9.1-amazoncorretto-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package
# RUN cd /home/app && mvn clean package
# RUN mvn -f /home/app/pom.xml clean package

RUN cd /home/app && mvn dependency:tree
#
# Package stage
#
FROM --platform=$TARGETPLATFORM mcr.microsoft.com/openjdk/jdk:17-distroless
COPY --from=build /home/app/target /home/app
CMD ["-jar","/home/app/debezium-reactivator-1.0.jar"]