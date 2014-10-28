#! /bin/bash

psql -c 'create database enterprise;' -U postgres
psql -c 'create database voyager;' -U postgres
psql -c 'create database borg;' -U postgres

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