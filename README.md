integration-testing
===================

Federation testing for a buddcloud server setup.

# Que?

The [Buddycloud channel server](https://github.com/buddycloud/buddycloud-server-java.git) has over 700 unit tests which helps us have a high level of confidence when rolling out updates to production (_please_feel_free_to_contribute_more_!). That said, some things can't, or are more easily, tested via integration tests. This is where this suite kicks in.

The job of this set up is to run up several Buddycloud channel servers connected to an XMPP server and fire messages at the server and to check that responses are as expected. Running up several servers also allows us to check that federation is working too.

# Test status

[![Build Status](https://travis-ci.org/buddycloud/integration-testing.svg?branch=master)](https://travis-ci.org/buddycloud/integration-testing)

# Testing

Primarily this setup is designed to be run on [travisci](http://travis-ci.org) on commit to the `master` branch of the [Buddycloud channel server](https://github.com/buddycloud/buddycloud-server-java.git) and may eventually be integrated into a bigger test suite (before the [docker image](https://registry.hub.docker.com/u/buddycloud/channel-server/) is generated for example).

## Running locally

### Manually

You will need:

* An XMPP server set up. We recommend [Prosody](http://prosody.im), an example configuration can be found [here](https://github.com/buddycloud/integration-testing/blob/master/resources/prosody.cfg.lua)
* [Node.js](http://nodejs.org/) installed (version 0.10 or greater)
* [PostgreSQL 9.3](http://www.postgresql.org/)
* [Java JDK](http://openjdk.java.net/)

### Using Docker

This project also has an [automated docker build](https://registry.hub.docker.com/u/buddycloud/integration-testing/) which you can use, rather than installing all the parts onto your system. To use the docker image run the following:

```
docker run -d --name buddycloud-integration-tests -p 5432:5432 -p 5222:5222 buddycloud/integration-testing
```

If you are running postgresql or an XMPP server locally then you'll probably want to change those port mappings and use the `XMPP_PORT` and `DATABASE_PORT` environment variables (no doubt you'll also need to set `DATABASE_HOST` too).

### Back to it....

You'll then need to set up some databases and configuration files:

* To install the channel server run the `setup-buddycloud.sh` script in the __resources__ directory
* Install the databases, run `setup-database.sh` in the __resources__ directory. If your postgres server is not on **localhost** then set an environment variable of `DATABASE_HOST` to point to its location, additionally a non-standard port number use `DATABASE_PORT`
* You need to set up some configuration files. See the [**travisci** examples](https://github.com/buddycloud/integration-testing/tree/master/resources/configuration/travisci), you will need to create a set of files in a directory named after your `NODE_ENV` environment variable (defaults to __development__)

Then...

```
# install dependencies
npm i .
# run the tests
npm test
# profit
```

__Note:__ To see more details on the running tests run as follows:

```
DEBUG=tests* npm test
```

If not using **localhost** or a **different xmpp client port number** then you'll need to set `XMPP_HOST` and `XMPP_PORT` environment variables.

# Writing tests

TBC