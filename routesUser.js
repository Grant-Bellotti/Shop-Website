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
    res.json( { error:false, message:'user is authenticated' } );
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

// Updates user's cart
router.post("/updateCart", function(req, res) {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    let product_id = parseInt(req.body.id);
    
    let index = -1;
    // Find index of item in cart
    for (let i = 0; i < req.session.cart.length; i++) {
      if (req.session.cart[i].product_id === product_id) {
        index = i;
        break;
      }
    }

    // Check if item is in cart, if it is, increment it
    if (index === -1) {
      req.session.cart.push({ product_id, quantity: 1 });
    } 
    else {
      req.session.cart[index].quantity++;
    }
    res.json( { error:false, message:'cart successfully updated', cart: req.session.cart } );
  } 
  // User is not authenticated
  else {
    res.json( { error:true, message:'user is not authenticated' } );
  }
});

// Updates quantity of items in card if the + or - buttons are pressed
router.post("/updateCartQuantity", function(req, res) {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    let product_id = parseInt(req.body.id);
    let type = String(req.body.type);

    let index = -1;
    // Find index of item in cart
    for (let i = 0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].product_id === product_id) {
            index = i;
            break;
        }
    }
    
    // Checks if the item is in the cart
    if (index !== -1) {
      // + was pressed
      if (type === 'plus') {
        req.session.cart[index].quantity++;
      } 
      // - was pressed
      else if (req.session.cart[index].quantity > 1) {
        req.session.cart[index].quantity--;
      } 
      // - was pressed and there was only 1 item
      else {
        req.session.cart.splice(index, 1); // Remove if quantity is 0
      }
      res.json( { error:false, message:'cart successfully updated' } );
    }
  } 
  // User is not authenticated
  else {
    res.json( { error:true, message:'user is not authenticated' } );
  }
});

// Get the cart items
router.get('/getCart', function(req, res){
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    let storedArray = req.session.cart;
    res.json( { error:false, message:'cart successfully recovered', cart: storedArray } );
  } 
  // User is not authenticated
  else {
    res.json( { error:true, message:'user is not authenticated' } );
  }
});

//////////////////////////////////////////////////////

module.exports = router;