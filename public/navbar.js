let params = (new URL(document.ocation)).searchParams;

//LEAD TO PDSP
let products_key = "Bracelets";
if (params.has('products_key')) {
    products_key = params.get('products_key');
}
else {
    products_key;
}

//LOAD CART
let shopping_cart;
let totalItemsIncart = 0;

loadJSON('/get_cart', function(response) {
    shopping_cart = JSON.parse(response);

    for (let productKey in shopping_cart) {
        let productQuantities = shopping_cart[productKey];

        let productTotalQuantity = productQuantities.reduce((accumulator, currentQuantity) => accumulator + currentQuantity);

        totalItemsInCart += productTotalQuantity;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    if(getCookie('user_cookie') != false) {
        let user_cookie = getCookie('user_cookie');

        if (document.getElementById('nav_container')) {
            document.querySelector('#nav_container').innerHTML += `
                <a class="nav-link mx-3 highlight" href="/logout.html">
                    <span class = "fa-solid fa-user highlight" style="color: #0C090A"></span> ${user_cookie['name']}
                </a>
            `
        }
        if (document.getElementById('user_name')) {
            document.getElementById('user_name').innerHTML = user_cookie['name'];
        }
    } else {
        document.querySelector('#nav_container').innerHTML += `
            <a class="nav-link mx-3 highlight" href="/login.html">
                    <span class = "fa-solid fa-user highlight" style="color: #0C090A"></span>Log in
            </a>
        `;
    }
});


//GET COOKIE
function getCookie(name) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieEnteries = decodedCookie.split(';');

    for (let i = 0; i < cookieEntries.length; i++) {
        let cookieEntry = cookieEntries[i];

        while (cookieEntry.charAt(0) == ' ') {
            cookieEntry = cookieEntry.substring(1);
        }

        if(cookieEntry.indexOf(name) == 0) {
            let cookieValueString = cookieEntry.substring(name.length, cookieEntry.length);
            return JSON.parse(cookieValueString);
        }
    }
    return "";
}

function updateCartTotal() {
    let newTotal = 0;

    for (let item of shopping_cart) {
        newTotal += item.quantity;
    }

    totalItemsIncart = newTotal;

    document.getElementById('cart_total').innerHTML = totalItemsInCart;
}