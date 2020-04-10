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

storeApp.displayProducts = (inventory) =>  {
    let result = '';
    inventory.forEach((item) => {
        result += `
            <!-- single product -->
            <article class="product">
            <div class="imgContainer">
                <img src=${item.url} alt=${item.title.split(' ').join('-')} class="productImg">
                <button class="bagBtn" data-id=${item.id}>
                    <i class="fas fa-shopping-cart">Add to cart</i>
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

// Get Add to Cart Buttons
storeApp.getAddToCartButtons = () => {
    const buttons = [...$('.bagBtn')]; // Arrau of all the buttons
    // console.log(buttons);

    //  get id for the buttons
    buttons.forEach(button => {
        let id = button.dataset.id;
        
        // check for the item in the cart
        let inCart = cart.find(item => item.id === id);
        if(!inCart){
            button.addEventListener('click', (event) => {
                $(event.target).text('In Cart');
                event.target.disabled = true;

                // get product from the inventory based on id
                let cartItem = storeApp.getProduct(id);
                cartItem = { ...storeApp.getProduct(id), amount: 1 };
                console.log(cartItem);

                // Add product to the cart  
                cart = [...cart, cartItem];
                console.log(cart);

                // Save cart in local storage   
                storeApp.saveCart(cart);             

                // Set cart Values
                storeApp.setCartValues(cart);
                
                // display cart item
                storeApp.addCartItem(cartItem);

                // show the cart  
                storeApp.showCart();                        
            })            
        } else {
        // cartItem.amount = cartItem.amount + 1; 
        }       
    })
}

// Get the products from Inventory
storeApp.getProduct = (id) => {
    return storeApp.Inventory.find(function(item){
        if(item.id === Number(id)){
            return item;
        }
    } );
}

// Save cart
storeApp.saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
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
    // console.log($cartTotal, $cartItems);
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
    console.log($cartContent);
}

// Show Cart
storeApp.showCart = () => {
    $cartOverlay.addClass('transparentBcg');
    $cartDOM.addClass('showCart')
}

// App init
storeApp.init = () => {    
    storeApp.displayProducts(storeApp.Inventory);
    storeApp.getAddToCartButtons();
}

// Document Ready
$(function(){
    storeApp.init();
}); 
