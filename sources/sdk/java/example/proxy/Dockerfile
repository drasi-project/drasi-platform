FROM --platform=$BUILDPLATFORM maven:3.9.9-amazoncorretto-21 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package
RUN cd /home/app && mvn dependency:tree

FROM --platform=$TARGETPLATFORM mcr.microsoft.com/openjdk/jdk:21-distroless
COPY --from=build /home/app/target /home/app
CMD ["-jar","/home/app/my-proxy-1.0.jar"]