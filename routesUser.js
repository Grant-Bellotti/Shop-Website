var express = require("express");
var passport = require("passport");

var router = express.Router();

//request is info sending to server from client.
//response is info sending to client from server.

////////////////////////////////////////////////////// Global Variables

//////////////////////////////////////////////////////

// check if user is already authenticated (user is auto authenticated)
router.get('/checkAuthenticated', function(req, res){
  if (req.isAuthenticated()) {
    let storedArray = req.session.cart;
    res.json( { error:false, message:'user is authenticated', cart: storedArray } );
  } 
  else {
    res.json( { error:true, message:'user is not authenticated' } );
  }
});

// authenticate the user
router.post("/authenticate", function(req, res, next) {
  next();

}, passport.authenticate("login", {
  successRedirect: "/successlogin",
  failureRedirect: "/faillogin",
  failureFlash: true
}));

// get the history of conversation
router.get('/getCart', function(req, res){
  if (req.isAuthenticated()) {
    let storedArray = req.session.cart;
    res.json( { error:false, message:'cart successfully recovered', cart: storedArray } );
  } 
  else {
    res.json( { error:true, message:'user is not authenticated' } );
  }
});

//////////////////////////////////////////////////////

module.exports = router;