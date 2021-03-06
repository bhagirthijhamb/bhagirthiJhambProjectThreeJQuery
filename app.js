// Namespace Object
const storeApp = {};

// Cart
let cart = [];

// Buttons
let buttonsDOM = [];

// Variables
const $productsDOM = $('.productsCenter');
const $cartTotal = $('.cartTotal');
const $cartItems = $('.cartItems');
const $cartBtn = $('.cartBtn');
const $closeCartBtn = $('.closeCart');
const $clearCartBtn = $('.clearCart');
const $cartDOM = $('.cart');
const $cartOverlay = $('.cartOverlay');
const $cartContent = $('.cartContent');

// Store Inventory
storeApp.Inventory = [
    {
        id: 1,
        title: "Brown Leather bag",
        price: 69.99,
        url: "./images/item1.jpeg"
    },
    {
        id: 2,
        title: "Checked Long Coat",
        price: 49.99,
        url: "./images/item2.jpeg"
    },
    {
        id: 3,
        title: "Black Leather Jacket",
        price: 54.99,
        url: "./images/item3.jpeg"
    },
    {
        id: 4,
        title: "Reversible Jacket",
        price: 39.99,
        url: "./images/item7.jpeg"
    },    
    {
        id: 5,
        title: "Striped top",
        price: 19.99,
        url: "./images/item5.jpeg"
    },
    {
        id: 6,
        title: "Golden White Tee",
        price: 24.99,
        url: "./images/item6.jpeg"
    },
    {
        id: 7,
        title: "Denim Jacket",
        price: 10.99,
        url: "./images/item4.jpeg"
    },    
    {
        id: 8,
        title: "Men Cool Tee",
        price: 14.99,
        url: "./images/item8.jpeg"
    },
    {
        id: 9,
        title: "Denim Top",
        price: 24.99,
        url: "./images/item9.jpeg"
    },
    {
        id: 10,
        title: "Brown Hat",
        price: 24.99,
        url: "./images/item10.jpeg"
    },
    {
        id: 11,
        title: "Classic Watch",
        price: 59.99,
        url: "./images/item11.jpeg"
    },
    {
        id: 12,
        title: "Leather Side Bag",
        price: 39.99,
        url: "./images/item12.jpeg"
    },
    {
        id: 13,
        title: "Floral Spring Shoes",
        price: 29.99,
        url: "./images/item13.jpeg"
    }
]

// Display Products
storeApp.displayProducts = (inventory) =>  {
    let result = '';
    inventory.forEach((item) => {
        result += `
            <!-- single product -->
            <article class="product">
            <div class="imgContainer">
                <img src=${item.url} alt=${item.title.split(' ').join('-')} class="productImg">
                <button class="bagBtn" data-id=${item.id}>
                    <i class="fas fa-shopping-cart" data-id=${item.id}>Add to cart</i>
                </button>
            </div>
            <h3>${item.title}</h3>
            <h4>$${item.price}</h4>
            </article>
            <!-- end of single product -->
        `;
    });
    $productsDOM.html(result);
}

// Display Cart Item
storeApp.addCartItem = (item) => {
    const div = $('<div></div>');
    div.addClass('cartItem');
    div.html(`
        <img src=${item.url} alt=${item.title.split(' ').join('-')}>
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="removeItem" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="itemAmount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
    `);
    $cartContent.append(div);
}

// Get the products from Inventory
storeApp.getProduct = (id) => {
    return storeApp.Inventory.find(function (item) {
        if (item.id === Number(id)) {
            return item;
        }
    });
}

// Get Add to Cart Buttons
storeApp.getAddToCartButtons = () => {
    const buttons = [...$('.bagBtn')];
    buttonsDOM = buttons;

    // Get id for the buttons
    buttons.forEach(button => {
        let btnId = button.dataset.id;       
        // check for the item in the cart
        let inCart = cart.find(item => item.id == btnId);
        
        // If the item is in the cart
        if(inCart){
            button.innerText = 'In Cart';
            button.disabled = true;
        }
        // If item is not in the cart
        button.addEventListener('click', (event) => {
            $(event.target).text('In Cart');
            event.target.disabled = true;
            let id = event.target.dataset.id;            
            // get product from the inventory based on id
            let cartItem = storeApp.getProduct(id);
            cartItem = { ...storeApp.getProduct(id), amount: 1 };
            // Add product to the cart  
            cart = [...cart, cartItem];
            // Save cart in local storage   
            storeApp.saveCart(cart);        
            // Set cart Values
            storeApp.setCartValues(cart);            
            // display cart item
            storeApp.addCartItem(cartItem);
            // show the cart  
            storeApp.showCart();                        
        })                          
    })
}

// Show Cart
storeApp.showCart = () => {
    $cartOverlay.addClass('transparentBcg');
    $cartDOM.addClass('showCart')
}

// Hide Cart
storeApp.hideCart = () => {
    $cartOverlay.removeClass('transparentBcg');
    $cartDOM.removeClass('showCart')
}

// Save cart to Local Storage
storeApp.saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Get cart from local storage
storeApp.getCart = () => {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
}

// Populate Cart
storeApp.populateCart = (cart) => {
    cart.forEach(item => storeApp.addCartItem(item));
}

// Set cart Values
storeApp.setCartValues = (cart) => {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
    });
    $cartTotal.text(`${parseFloat(tempTotal.toFixed(2))}`);
    $cartItems.text(`${itemsTotal}`);
}

// Cart Logic
storeApp.cartLogic = () => {
    $clearCartBtn.on('click', () => {
        storeApp.clearCart();
    })

    // Cart Functionality
    $cartContent.on('click', (event) => {
        if($(event.target).hasClass('removeItem')){
            let removeItem = event.target;
            let $removeItem = $(event.target);
            let id = Number(removeItem.dataset.id);
            
            $cartContent.children().find($removeItem).parent().parent().remove();

            storeApp.removeItem(id);
        }
        else if ($(event.target).hasClass('fa-chevron-up')) {
            let addAmount = event.target;
            let $addAmount = $(event.target);
            let id = Number(addAmount.dataset.id);

            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount + 1;
            storeApp.saveCart(cart);
            storeApp.setCartValues(cart);
            $addAmount.next().text(`${tempItem.amount}`);
        }
        else if ($(event.target).hasClass('fa-chevron-down')) {
            let lowerAmount = event.target;
            let $lowerAmount = $(event.target);
            let id = Number(lowerAmount.dataset.id);

            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount - 1;
            if (tempItem.amount > 0) {
                storeApp.saveCart(cart);
                storeApp.setCartValues(cart);
                $lowerAmount.prev().text(`${tempItem.amount}`);
            } else {
                $cartContent.children().find($lowerAmount).parent().parent().remove();
                storeApp.removeItem(id);
            }
        }
    });
}

// Clear Cart
storeApp.clearCart = () => {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => storeApp.removeItem(id));

    //Remove items from the DOM
    while($cartContent.children().length > 0){
        $cartContent.children()[0].remove();
    }
    storeApp.hideCart();
}

// Remove item from the cart
storeApp.removeItem = (id) => {
    cart = cart.filter(item => item.id !== id);
    storeApp.setCartValues(cart);
    storeApp.saveCart(cart);
    let button = storeApp.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to cart`;
}

// Get button
storeApp.getSingleButton = (id) => {
    return buttonsDOM.find(button => button.dataset.id == id);
}

// Setup App
storeApp.setupApp = () => {
    cart = storeApp.getCart();
    storeApp.setCartValues(cart);
    storeApp.populateCart(cart);
    $cartBtn.on('click', storeApp.showCart);
    $closeCartBtn.on('click', storeApp.hideCart);
}

// App init
storeApp.init = () => {    
    storeApp.setupApp();
    storeApp.displayProducts(storeApp.Inventory);
    storeApp.getAddToCartButtons();
    storeApp.cartLogic();
}

// Document Ready
$(function(){
    storeApp.init();
}); 
