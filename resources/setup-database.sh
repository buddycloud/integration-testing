#! /bin/bash

[ -z "$DATABASE_HOST" ] && export DATABASE_HOST=localhost
[ -z "$DATABASE_PORT" ] && export DATABASE_PORT=5432

if [ -z "$DATABASE_USER" ]; then
    DATABASE_USER=postgres
fi

PGPASSWORD="$DATABASE_PASSWORD" psql -c 'create database enterprise;'  -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER 
PGPASSWORD="$DATABASE_PASSWORD" psql -c 'create database voyager;' -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER 
PGPASSWORD="$DATABASE_PASSWORD" psql -c 'create database borg;' -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER 

databases=( enterprise voyager borg)
files=$(find ./buddycloud-server-java/postgres -name "upgrade*.sql")

for i in "${databases[@]}"
do
    PGPASSWORD=$DATABASE_PASSWORD psql -d $i -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER < ./buddycloud-server-java/postgres/install.sql
    for j in $files
    do
        echo "$i - $j"
        PGPASSWORD=$DATABASE_PASSWORD psql -d $i -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER < $j
    done
done