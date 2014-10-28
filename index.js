var Yadda = require('yadda')
  , glob = require('glob')
  , spawn = require('child_process').spawn
  , debug = require('debug')
  , log   = debug('index')
  , forEach = require('async-foreach').forEach

Yadda.plugins.mocha.StepLevelPlugin.init()

var path = process.env.PATH.split(':')
path.unshift(__dirname + '/resources/configuration')
process.env.PATH = path.join(':')

console.log(path.join(':'))
var stepDefinitions = function() {
    var libraries = []
    var stepsPath = process.cwd() + '/steps/**/*.js'
    var options = { cwd: __dirname }
    glob.sync(stepsPath, options).forEach(function(stepDefinitionFile) {
        libraries.push(require(stepDefinitionFile.replace('.js', '')))
    })
    return libraries
}()

var environment = /*process.env.NODE_ENV ||*/ 'travisci'
var pids = {}
var servers = [ 'enterprise', 'voyager', 'borg' ]


var startChannelServer = function(server, done) {
   log('Starting \'' + server + '\'')
   var serverLog = debug('server-' + server)
   var child = spawn(
       'java',
       [
           '-jar',
           '../../../../buddycloud-server-java/target/channelserver-jar-with-dependencies.jar'
       ],
       { cwd: __dirname + '/resources/configuration/' + environment + '/' + server, env: process.env }
   )
   child.stdout.on('data', function(data) {
      serverLog(data.toString('utf8'))
    })
   
    child.stderr.on('error', function(data) {
      serverLog('error', data.toString('utf8'))
    })

    child.on('close', function(code) {
      serverLog('*** Process exited with code ' + code)
      done('error')
    })
    pids[server] = child
    /* TODO: Watching incoming stdout for server started message and then done() */
    setTimeout(function() { done() }, 2000)
}

before(function(done) {
   console.log('before')
   forEach(servers, function(server) {
       startChannelServer(server, this.async())
   }, function() {
       done()
   })
})

after(function(done) {
    console.log('after')
    forEach(servers, function(server) {
        var done = this.async()
        log('Stopping \'' + server + '\'')
        pids[server].kill('SIGTERM')
        done()
    }, function() { done() })
})

new Yadda.FeatureFileSearch('./features').each(function(file) {

  featureFile(file, function(feature) {

    var yadda = new Yadda.Yadda(stepDefinitions)

    scenarios(feature.scenarios, function(scenario) {
      steps(scenario.steps, function(step, done) {
        yadda.yadda(step, done)
      })
    })
  })
})