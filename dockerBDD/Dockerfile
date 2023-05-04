FROM mariadb:10.3

ENV MYSQL_ROOT_PASSWORD=123456789
ENV MYSQL_DATABASE=livreAccueil

COPY dump.sql /docker-entrypoint-initdb.d/
COPY trigger.sql /docker-entrypoint-initdb.d/

EXPOSE 3306