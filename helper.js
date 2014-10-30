var Client = require('node-xmpp-client')
  , log = require('debug')('tests:helper')
  , Buddycloud = require('xmpp-ftw-buddycloud')
  , Event = require('events').EventEmitter
  , userMap = require('./utils/user-map')

var connectedUsers = {}
var lastConnection = null

var XmppEventer = function() {}
XmppEventer.prototype = new Event()
XmppEventer.prototype.send = function(stanza) {
    this.emit('stanza', stanza.root())
}

var SocketEventer = function() {}
SocketEventer.prototype = new Event()
SocketEventer.prototype.send = function(event, data, callback) {
    this.emit(event, data, callback)
}
socket = new SocketEventer()
xmpp = new XmppEventer()

manager = {
    socket: socket,
    client: xmpp,
    tracking: {},
    trackId: function(id, callback) {
        if (!id)
            throw new Error(this.MISSING_STANZA_ID)
        var jid
        if (typeof id === 'object') {
            if (!id.root().attrs.id)
                throw new Error(this.MISSING_STANZA_ID)
            jid = id.root().attrs.to
            id = id.root().attrs.id
            if (!jid){
                jid = [
                    this.getJidType('domain'),
                    this.getJidType('bare')
                ]
            } else {
                jid = [ jid ]
            }
        }
        if (!callback)
            throw new Error(this.MISSING_CALLBACK)
        if (typeof callback !== 'function')
            throw new Error(this.INVALID_CALLBACK)
        if (!this.client) {
            return this.handleError(this.error.condition.NOT_CONNECTED)
        }
        this.tracking[id] = { callback: callback, jid: jid }
    },
    makeCallback: function(error, data) {
        this.callback(error, data)
    },
    setConnection: function(connection) {
        this.client = connection
        var self = this
        this.client.on('stanza', function(stanza) { self.catchTracked(stanza) })
    },
    getConnection: function() {
        return this.client
    },
    getSocket: function() {
        return this.socket
    },
    _getLogger: function() {
        return {
            log: function() {},
            info: function() {},
            error: function() {},
            warn: function() {}
        }
    },
    catchTracked: function(stanza) {
        var id = stanza.root().attr('id')
        if (!id || !this.tracking[id]) return false
        if (this.tracking[id].jid &&
            stanza.attr('from') &&
            (-1 === this.tracking[id].jid.indexOf(stanza.attr('from')))) {
            // Ignore stanza its an ID spoof!
            return true
        }
        this.tracking[id].callback(stanza)
        delete this.tracking[id]
        return true
    },
    getJidType: function(type) {
        switch (type) {
            case 'full':
                return this.client.jid.user + '@' +
                    this.client.jid.domain + '/' +
                    this.client.jid.resource
            case 'bare':
                return this.client.jid.user + '@' + this.client.jid.domain
            case 'domain':
                return this.client.jid.domain
        }
    }
}
var buddycloud = new Buddycloud()
buddycloud.init(manager)
buddycloud.setDiscoveryTimeout(300)

var getConnection = function(user, server, callback, registered) {
    var options = userMap.getDetails(user, server)
    if (!registered) {
        options.register = true
    }
    var client = new Client(options)
    log('Attempting to log in ', options)
    client.on('online', function(data) {
        log('User ' + user + '@' + server + ' logged in')
        connectedUsers[user + '@' + server] = client
        lastConnection = client
        callback(null, client)
    })
    client.on('error', function(error) {
        if (error.message === 'Registration error') {
            log('User already registered, so logging in')
            delete options.register
            return getConnection(user, server, callback, true)
        }
        log('Error logging in', error)
        callback(error)
    })
    
}

var setLastConnection = function(connection) {
    manager.setConnection(connection)
}

var getLastConnection = function() {
    manager.setConnection(lastConnection)
    return lastConnection
}

module.exports = {
    getConnection: getConnection,
    buddycloud: buddycloud,
    manager: manager,
    getLastConnection: getLastConnection
}