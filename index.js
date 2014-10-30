var Yadda = require('yadda')
  , glob = require('glob')
  , spawn = require('child_process').spawn
  , debug = require('debug')
  , log   = debug('tests:index')
  , forEach = require('async-foreach').forEach

Yadda.plugins.mocha.StepLevelPlugin.init()

var stepDefinitions = function() {
    var libraries = []
    var stepsPath = process.cwd() + '/steps/**/*.js'
    var options = { cwd: __dirname }
    glob.sync(stepsPath, options).forEach(function(stepDefinitionFile) {
        libraries.push(require(stepDefinitionFile.replace('.js', '')))
    })
    return libraries
}()

var environment = process.env.NODE_ENV || 'development'
var pids = {}
var servers = [ 'enterprise', 'voyager', 'borg' ]

var startChannelServer = function(server, done) {
   log('Starting \'' + server + '\'')
   var serverLog = debug('tests:server-' + server)
   var child = spawn(
       'java',
       [
           '-jar',
           '../../../../buddycloud-server-java/target/channelserver-jar-with-dependencies.jar'
       ],
       { cwd: __dirname + '/resources/configuration/' + environment + '/' + server, env: process.env }
   )
   var started = false
   child.stdout.on('data', function(data) {
      serverLog(data.toString('utf8'))
      if ((false === started) &&
          (-1 !== data.toString('utf8').indexOf('ready to accept packages'))) {
          started = true
          done()
      }   
    })
   
    child.stderr.on('error', function(data) {
      serverLog('error', data.toString('utf8'))
    })

    child.on('close', function(code) {
      serverLog('*** Process exited with code ' + code)
      done('error')
    })
    pids[server] = child
}

before(function(done) {
    log('Running tests start function')
    this.timeout(30000)
    forEach(servers, function(server) {
        startChannelServer(server, this.async())
    }, function() {
        log('All channel servers started')
        done()
    })
})

after(function(done) {
    log('Running tests completion function')
    this.timeout(30000)
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
      var context = {
          params: {
              channelServer: {}
          }
      }
      steps(scenario.steps, function(step, done) {
        yadda.yadda(step, context, done)
      })
    })
  })
})