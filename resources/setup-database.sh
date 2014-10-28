#! /bin/bash

[ -z "$DATABASE_HOST" ] && export DATABASE_HOST=localhost
[ -z "$DATABASE_PORT" ] && export DATABASE_PORT=5432

psql -c 'create database enterprise;' -U postgres -p $DATABASE_PORT -h $DATABASE_HOST
psql -c 'create database voyager;' -U postgres -p $DATABASE_PORT -h $DATABASE_HOST
psql -c 'create database borg;' -U postgres -p $DATABASE_PORT -h $DATABASE_HOST

databases=( enterprise voyager borg)
files=$(find ./buddycloud-server-java/postgres -name "upgrade*.sql")

for i in "${databases[@]}"
do
    psql -U postgres $i < ./buddycloud-server-java/postgres/install.sql
    for j in $files
    do
        echo "$i - $j"
        psql -U postgres $i < $j
    done
done