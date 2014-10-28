var library = require('yadda').localisation.English.library
  , helper = require('../helper')

module.exports = (function() {
  return library()
    .given('I connect as the $server\'s $crew', function(server, user, next) {
       helper.getConnection(user, server, function(error, connection) {
           if (error) return next(error)
           helper.setLastConnection(connection)
           next()
       })
    })
    .given('I run disco#items against the server', function(next) {
        helper.buddycloud.discoverItems({}, function(error, items) {
            if (error) return next(error)
            this.params.disco = { items: items}
            next()
        })
    })
    .when('I see the channel server', function(next) {
        var params = this.params
        params.disco.items.forEach(function(item) {
            helper.buddycloud.discoverFeatures({ of: item.jid }, function(error, info) {
                info.forEach(function(feature) {
                    if (('identity' === feature.kind) &&
                        (feature.category && 'pubsub' === feature.category) &&
                        (feature.type && 'channels' === feature.type)) {
                        params.disco.channelServer = info
                        next()
                    }
                })      
            })  
        })
    })
    .then('I expect it to see the correct disco#info', function(next) {
        console.log(this.params.disco.channelServer)
        next()
    })
})()