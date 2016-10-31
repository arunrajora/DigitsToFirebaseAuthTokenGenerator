
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , firebase = require("firebase")
  , app = express()
  , twitterAPI = require('node-twitter-api');
firebase.initializeApp({
  serviceAccount: "SEVER_JSON_CONFIG_FILE_PATH.json",
  databaseURL: "https://FIREBASE_DATABASE_URL.firebaseio.com"
});

var twitter = new twitterAPI({
    consumerKey: 'TWITTER_CONSUMER_KEY',
    consumerSecret: 'TWITTER_CONSUMER_SECRET_KEY',
});


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
app.post('/token', function(req, res) {
    var ph_no = req.body.number,
        utoken = req.body.token,
        usecret = req.body.secret;
        var uid =ph_no;
    var additionalClaims = {
        token: utoken,
        secret: usecret
      };
      twitter.verifyCredentials(utoken,usecret,{}, function(error, data, response) {
    if (error) {
      res.send("auth failed");
    } else {
    var token = firebase.auth().createCustomToken(uid, additionalClaims);
    res.send(token);
    }
});

});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
