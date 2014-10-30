var library = require('yadda').localisation.English.library
  , helper = require('../helper')

module.exports = (function() {
  return library()
    .given('I connect as the $server\'s $crew', function(server, user, next) {
       helper.getConnection(user, server, function(error, connection) {
           if (error) return next(error)
           next()
       })
    })
    .given('I run disco#items against the server', function(next) {
        var payload = { of: helper.getLastConnection().jid.domain }
        var params = this.params
        helper.buddycloud.discoverItems(payload, function(error, items) {
            if (error) return next(error)
            params.disco = { items: items}
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
        var info = this.params.disco.channelServer
        var checkFor = function(kind, type, category) {
            var found = false
            info.some(function(entry) {
                var field = !!category ? 'type' : 'var'
                if ((kind === entry.kind) && (type === entry[field]) && (category === entry.category)) {
                    return found = true
                }
            })
            if (!found) {
                next('Missing \'disco#info\' entry')
            }
        }
        checkFor('identity', 'channels', 'pubsub')
        checkFor('identity', 'inbox', 'pubsub')
        checkFor('feature', 'http://jabber.org/protocol/disco#info')
        checkFor('feature', 'jabber:iq:register')
        checkFor('feature', 'http://jabber.org/protocol/disco#items')
        checkFor('feature', 'jabber:iq:search')
        next()
    })
})()