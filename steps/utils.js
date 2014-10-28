var library = require('yadda').localisation.English.library

module.exports = (function() {
  return library()
    .given('I do nothing', function(next) {
       console.log('I did nothing')
       next()
    })
})()