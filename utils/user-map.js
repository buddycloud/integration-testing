var serverMap = {
    'enterprise': 'enterprise.sf',
    'voyager': 'voyager.sf',
    'borg': 'borg.collective'
}

var getDetails = function(user, server) {
    var domain = serverMap[server.toLowerCase()]
    if (!domain) throw new Error('Unknown group (' + server + ')!')
    return {
        jid: user + '@' + domain,
        host: process.env.XMPP_HOST || 'localhost',
        port: process.env.XMPP_PORT || 5222
    }
}



module.exports = {
    getDetails: getDetails
}