// jQuery selectors for various elements
const $listProductHTML = $('.products');
const $listCartHTML = $('.cart-list');
const $iconCart = $('.icon-cart');
const $iconCartSpan = $('.cart-amount');
const $body = $('body');
const $closeCart = $('.close');

let products = [];
let cart = [];

// Hide or show cart
$iconCart.add($closeCart).on('click', function toggleCart() {
    $body.toggleClass('showCart');
});

// Updates product list
function updateProducts() {
    $listProductHTML.empty();
    // Loop through products and create HTML elements
    for (let i = 0; i < products.products.length; i++) {
        const product = products.products[i];
        const $newProduct = $(`
            <div class="product-item" data-id="${product.id}">
                <h2>${product.title}</h2>
                <div class="product-item-img-box">
                    <img src="${product.images[0]}" alt="">
                </div>
                <div class="product-item-price">$${product.price}</div>
                <button class="product-item-button">Add To Cart</button>
            </div>
        `);
        $listProductHTML.append($newProduct);
    }
}

// Event listener for adding to cart button
$listProductHTML.on('click', '.product-item-button', function addToCartHandler() {
    const product_id = $(this).parent().data('id');
    addToCart(product_id);
});

// Add product to cart
function addToCart(product_id) {
    const index = cart.findIndex(function findItem(item) {
        return item.product_id === product_id;
    });
    // Check if item is in cart, if it is, increment it
    if (index === -1) {
        cart.push({ product_id, quantity: 1 });
    } else {
        cart[index].quantity++;
    }
    updateCart();
}

// Update the cart
function updateCart() {
    $listCartHTML.empty();
    let totalQuantity = 0;
    // Create HTML elements in cart
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const info = products.products.find(function findProduct(product) {
            return product.id === item.product_id;
        });
        totalQuantity += item.quantity;
        const $newItem = $(`
            <div class="product-item-cart" data-id="${item.product_id}">
                <div class="cart-list-image">
                    <img src="${info.images[0]}">
                </div>
                <div class="cart-list-name">${info.title}</div>
                <div class="cart-list-price">$${info.price * item.quantity}</div>
                <div class="cart-list-quantity">
                    <div class="cart-list-minus">-</div>
                    <span>${item.quantity}</span>
                    <div class="cart-list-plus">+</div>
                </div>
            </div>
        `);
        $listCartHTML.append($newItem);
    }
    $iconCartSpan.text(totalQuantity);
}

// Event listener for changing quantity in cart
$listCartHTML.on('click', '.cart-list-minus, .cart-list-plus', function changeQuantityHandler() {
    const product_id = $(this).parent().parent().data('id');
    const type = $(this).hasClass('cart-list-plus') ? 'plus' : 'minus';
    changeQuantityCart(product_id, type);
});

// Function to change quantity
function changeQuantityCart(product_id, type) {
    const index = cart.findIndex(function findItem(item) {
        return item.product_id === product_id;
    });
    if (index !== -1) {
        if (type === 'plus') {
            cart[index].quantity++;
        } else if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1); // Remove if quantity is 0
        }
        updateCart();
    }
}

// Get products from dummy API
fetch('https://dummyjson.com/products')
.then(function handleResponse(res) {
    return res.json();
})
.then(function handleData(data) {
    products = data;
    updateProducts();
});
