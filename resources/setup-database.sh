#! /bin/bash

psql -c 'create database enterprise;' -U postgres
psql -c 'create database voyager;' -U postgres
psql -c 'create database borg;' -U postgres

cd buddycloud-server-java

databases=( enterprise voyager borg)
files=`find ./postgres -name "upgrade*.sql"`

for i in "${databases[@]}"
do
    psql -U postgres $i < ./postgres/install.sql
    for j in "${files[@]}"
    do
        psql -U postgres $i < $j
    done
done