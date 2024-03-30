// jQuery selectors for various elements
const $productsHTML = $('.products');
const $cartHTML = $('.cart-list');
const $cartIcon = $('.icon-cart');
const $cartAmount = $('.cart-amount');
const $searchOptions = $('.search-options');
const $totalAmount = $('.checkout');
const $body = $('body');
const $closeCart = $('.close');

const productsPerPage = 28;

let currentPage = 1;    // Current page user is on
let productsAmount = 0; // Amount of products in current category
let shownProduct = [];  // Products currently on screen
let allProducts = [];   // All products in database
let cart = [];          // Products in cart

//////////////////////////////////////// Products

// Updates product list
function updateProducts() {
    $productsHTML.empty();

    // Loop through products and create HTML elements
    for (let i = 0; i < shownProduct.length; i++) {
        let currentProduct = shownProduct[i];
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

// Gets correct amount of products for each page
function getProductsPerPage(category, search=false) {
    if (search == true) {
        // Get total products in category to store amount in productsAmount
        fetch(`https://dummyjson.com/`+category+`&skip=${0}&limit=${1}`)
        .then(function handleResponse(res) {
            return res.json();
        })
        .then(function handleData(data) {
            productsAmount = parseInt(data.total);

            // Get products for page
            fetch(`https://dummyjson.com/`+category+`&skip=${(currentPage - 1) * productsPerPage}&limit=${productsPerPage}`)
            .then(function handleResponse(res) {
                return res.json();
            })
            .then(function handleData(data) {
                shownProduct = data.products; 
                updateProducts();
            });
        });
    }
    else {
        // Get total products in category to store amount in productsAmount
        fetch(`https://dummyjson.com/`+category+`?skip=${0}&limit=${1}`)
        .then(function handleResponse(res) {
            return res.json();
        })
        .then(function handleData(data) {
            productsAmount = parseInt(data.total);

            // Get products for page
            fetch(`https://dummyjson.com/`+category+`?skip=${(currentPage - 1) * productsPerPage}&limit=${productsPerPage}`)
            .then(function handleResponse(res) {
                return res.json();
            })
            .then(function handleData(data) {
                shownProduct = data.products; 
                updateProducts();
            });
        });
    }
}

// Gets selected category and calls getProductsPerPage to update page
function getCategory() {
    selectedCategory = String($('.search-options').val());
    searchVal = String($('.search-input').val());

    // If user isn't searching with text
    if (searchVal.trim() === "") {
        // If user wants to see all products
        if (selectedCategory === 'all') {
            getProductsPerPage("products");
        }
        // if user is searching through sorting
        else {
            getProductsPerPage(String("products/category/"+selectedCategory));
        }
    }
    // If user is trying to search
    else {
        getProductsPerPage(String("products/search?q="+searchVal), true);
    }
}

////////////////////////////////////////

//////////////////////////////////////// Cart
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
        for (let i = 0; i < allProducts.length; i++) {
            if (allProducts[i].id === item.product_id) {
                currentProduct = allProducts[i];
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
                    <button class="cart-list-minus">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-list-plus">+</button>
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
        for (let j = 0; j < allProducts.length; j++) {
            if (allProducts[j].id === item.product_id) {
                currentProduct = allProducts[j];
                break;
            }
        }

        // Calculate price and add to total
        totalPrice += currentProduct.price * item.quantity;
    }

    // Update total cost button
    $totalAmount.text('Check Out $' + totalPrice.toFixed(2));
}

////////////////////////////////////////

//////////////////////////////////////// Event Handlers

// Hide or show cart
$cartIcon.add($closeCart).on('click', function toggleCart() {
    $body.toggleClass('showCart');
});
// Event listener for search input
$('.search-input').on('click', function() {
    searchVal = String($('.search-input').val(""));
});
// Event listener for category input
$('.search-options').on('click', function() {
    searchVal = String($('.search-input').val(""));
});
// Event listener for the search button
$('.search-button').on('click', function() {
    currentPage = 1;
    $('.current-page').text('Page ' + currentPage);
    getCategory();
});
// Event listener for the home button
$('.search-button-home').on('click', function() {
    location.reload();
});
// Event listener for pressing Enter key in the input field
$('.search-input').on('keypress', function(event) {
    if (event.which === 13) { // Check if enter pressed
        currentPage = 1;
        $('.current-page').text('Page ' + currentPage);
        getCategory();
    }
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
// Event listener for previous page button
$('.prev-page').on('click', function() {
    if (currentPage > 1) {
        currentPage -= 1;
        $('.current-page').text('Page ' + currentPage);
        getCategory();
    }
});
// Event listener for next page button
$('.next-page').on('click', function() {
    if (currentPage < Math.ceil(productsAmount/productsPerPage)) {
        currentPage += 1;
        $('.current-page').text('Page ' + currentPage);
        getCategory();
    }
});

////////////////////////////////////////

$(document).ready(function(){
    // Get amount of products
    fetch(`https://dummyjson.com/products?skip=${0}&limit=${1}`)
    .then(function handleResponse(res) {
        return res.json();
    })
    .then(function handleData(data) {
        productsAmount = parseInt(data.total); // Amount of products in a category

         // Get all products and save to list
        fetch(`https://dummyjson.com/products?skip=${0}&limit=${productsAmount}`)
        .then(function handleResponse(res) {
            return res.json();
        })
        .then(function handleData(data) {
            allProducts = data.products;

            // Update first page
            getCategory();
            updateCart()
        });
    });

    // Populate category box
    fetch('https://dummyjson.com/products/categories')
    .then(res => res.json())
    .then(function(categories) {
        categories.forEach(category => {
            $searchOptions.append(`<option value="${category}">${category}</option>`);
        });
    });
    
});
