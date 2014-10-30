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
})()