var library = require('yadda').localisation.English.library
  , helper = require('../helper')
require('should')

module.exports = (function() {
  return library()
    .given('I register with the server', function(next) {
        var payload = { of: helper.getLastConnection().jid.domain }
        var params = this.params
        helper.buddycloud.discover({}, function(error, server) {
            params.channelServer[helper.getLastConnection().jid.domain] = server
            if (error) return next(error)
            helper.buddycloud.channelServer = server
            helper.buddycloud.setRegister({}, function(error, success) {
                if (error) return next(error)
                success.registered.should.be.true
                next()
            })
        })
    })
    .then('I expect it to see personal nodes set up', function(next) {
        var channelServer = this.params.channelServer[helper.getLastConnection().jid.domain]
        var jid = helper.getLastConnection().jid.user +
            '@' +
            helper.getLastConnection().jid.domain
        var expectNode = function(items, node) {
            var complete = false
            items.some(function(item) {
                item.jid.should.equal(channelServer)
                if (item.node === '/user/' + jid + '/' + node) {
                    next()
                    return complete = true
                }
                return false
            })
            if (!complete) next('Not all personal nodes found')
        }
        helper.buddycloud.discoverItems({ of: channelServer }, function(error, items) {
            if (error) return next(error)
            expectNode(items, 'posts')
        })
    })
})()