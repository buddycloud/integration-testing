#! /bin/bash

[ -z "$DATABASE_HOST" ] && export DATABASE_HOST=localhost
[ -z "$DATABASE_PORT" ] && export DATABASE_PORT=5432

if [ -z "$DATABASE_USER" ]; then
  PGPASSWORD="$DATABASE_PASSWORD"
else
  DATABASE_USER=postgres
fi

psql -c 'create database enterprise;'  -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER 
psql -c 'create database voyager;' -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER 
psql -c 'create database borg;' -p $DATABASE_PORT -h $DATABASE_HOST -U $DATABASE_USER 

databases=( enterprise voyager borg)
files=$(find ./buddycloud-server-java/postgres -name "upgrade*.sql")

for i in "${databases[@]}"
do
    if [ -z "$DATABASE_USER" ]; then
        psql -U $DATABASE_USER -d $i < ./buddycloud-server-java/postgres/install.sql
    else
        psql -U postgres $i < ./buddycloud-server-java/postgres/install.sql
    fi
    for j in $files
    do
        echo "$i - $j"
        psql -U $DATABASE_USER $i < $j
    done
done