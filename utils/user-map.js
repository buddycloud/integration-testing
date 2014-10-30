var serverMap = {
    'enterprise': {
        domain: 'enterprise.sf',
        users: {
            riker: 'i-am-number-one'
        }
    },
    'voyager': {
        domain: 'voyager.sf',
        users: {}
    },
    'borg': {
        domain: 'borg.collective',
        users: {}
    }
}

var getDetails = function(local, server) {
    var local = local.toLowerCase()
    var server = server.toLowerCase()
    
    var domain = serverMap[server]
    if (!domain.domain) throw new Error('Unknown group (' + server + ')!')
    var password = domain.users[local]
    if (!password) throw new Error('Unknown user (' + local + '@' + server + ')!')
    return {
        jid: local + '@' + domain.domain,
        password: password,
        host: process.env.XMPP_HOST || 'localhost',
        port: process.env.XMPP_PORT || 5222
    }
}

module.exports = {
    getDetails: getDetails
}