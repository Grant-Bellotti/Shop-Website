// jQuery selectors for various elements
const $productsHTML = $('.products');
const $cartHTML = $('.cart-list');
const $cartIcon = $('.icon-cart');
const $cartAmount = $('.cart-amount');
const $totalAmount = $('.checkout');
const $body = $('body');
const $closeCart = $('.close');

let products = [];
let cart = [];

// Updates product list
function updateProducts() {
    $productsHTML.empty();

    // Loop through products and create HTML elements
    for (let i = 0; i < products.length; i++) {
        let currentProduct = products[i];
        let $newProduct = $(`
            <div class="product-item" data-id="${currentProduct.id}">
                <h2>${currentProduct.title}</h2>
                <div class="product-item-img-box">
                    <img src="${currentProduct.images[0]}" alt="">
                </div>
                <div class="product-item-price">$${currentProduct.price}</div>
                <button class="product-item-button">Add To Cart</button>
            </div>
        `);

        $productsHTML.append($newProduct);
    }
}

// Update the cart
function updateCart() {
    $cartHTML.empty();
    let totalQuantity = 0;

    $.ajax({
        url: "/getCart",
        type: "GET",
        async: false,
        data: { },
        success: function(data){
            if (data.error == false) {
                cart = data.cart;
            } 
        },
        dataType: "json"
    });
    
    // Create HTML elements in cart
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];

        //find correct product
        let currentProduct;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === item.product_id) {
                currentProduct = products[i];
                break;
            }
        }
        totalQuantity += item.quantity;

        //create cart HTML element
        let $newItem = $(`
            <div class="product-item-cart" data-id="${item.product_id}">
                <div class="cart-list-image">
                    <img src="${currentProduct.images[0]}">
                </div>
                <div class="cart-list-name">${currentProduct.title}</div>
                <div class="cart-list-price">$${currentProduct.price * item.quantity}</div>
                <div class="cart-list-quantity">
                    <div class="cart-list-minus">-</div>
                    <span>${item.quantity}</span>
                    <div class="cart-list-plus">+</div>
                </div>
            </div>
        `);

        $cartHTML.append($newItem);
    }
    //update cart amount
    $cartAmount.text(totalQuantity);
    updateTotalCost();
}

// Add product to cart
function addToCart(product_id) {
    // Update server side cart
    $.ajax({
        url: "/updateCart",
        type: "POST",
        data: { id: product_id },
        success: function(data){
            if (data.error == false) {
                cart = data.cart;
            }
        },
        dataType: "json"
      });
    updateCart();
}

// Function to change quantity in cart
function changeQuantityCart(product_id, type) {
    // Update server side
    $.ajax({
        url: "/updateCartQuantity",
        type: "POST",
        async: false,
        data: { id: product_id, type: type },
        success: function(data){
            if (data.error == false) {
                cart = data.cart;
            } 
        },
        dataType: "json"
    });
    updateCart();
}

// Update total cost button
function updateTotalCost() {
    let totalPrice = 0;

    // Each item in cart
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        
        // Find product
        let currentProduct;
        for (let j = 0; j < products.length; j++) {
            if (products[j].id === item.product_id) {
                currentProduct = products[j];
                break;
            }
        }

        // Calculate price and add to total
        totalPrice += currentProduct.price * item.quantity;
    }

    // Update total cost button
    $totalAmount.text('Check Out $' + totalPrice.toFixed(2));
}


// Hide or show cart
$cartIcon.add($closeCart).on('click', function toggleCart() {
    $body.toggleClass('showCart');
});
// Event listener for adding to cart button
$productsHTML.on('click', '.product-item-button', function addToCartHandler() {
    const product_id = $(this).parent().data('id');
    addToCart(product_id);
});
// Event listener for changing quantity in cart
$cartHTML.on('click', '.cart-list-minus, .cart-list-plus', function changeQuantityHandler() {
    const product_id = $(this).parent().parent().data('id');
    const type = $(this).hasClass('cart-list-plus') ? 'plus' : 'minus';
    changeQuantityCart(product_id, type);
});

$(document).ready(function(){
    // Get products from dummy API
    fetch('https://dummyjson.com/products')
    .then(function handleResponse(res) {
        return res.json();
    })
    .then(function handleData(data) {
        products = data.products;
        updateProducts();
        updateCart()
    });
});
