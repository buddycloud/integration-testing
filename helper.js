var Client = require('node-xmpp-client')
  , log = require('debug')('tests:helper')
  , Buddycloud = require('xmpp-ftw-buddycloud')
  , Event = require('events').EventEmitter
  , userMap = require('./utils/user-map')

var connectedUsers = {}


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
    trackId: function(id, callback) {
        if (typeof id !== 'object') {
            throw new Error('Stanza protection ID not added')
        }
        this.callback = callback
    },
    makeCallback: function(error, data) {
        this.callback(error, data)
    },
    setConnection: function(connection) {
        this.client = connection
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
    }
}
var buddycloud = new Buddycloud()
buddycloud.init(manager)

var getConnection = function(user, server, callback) {
    var options = userMap.getDetails(user, server)
    var client = new Client(options)
    
}

var setLastConnection = function(connection) {
    manager.setConnection(connection)
}

module.exports = {
    getConnection: getConnection,
    buddycloud: buddycloud,
    manager: manager,
    setLastConnection: setLastConnection
}