window.onload = function() {
    let params = (new URL(document.location)).searchParams;
  
    if (!params.has('valid')) {
        document.write(`
            <body style="text-align: center; margin-top: 10%;">
                <h2>ERROR: No valid form submission detected.</h2>
                <h4>Return to <a href="index.html">Home</a></h4> 
            </body>
        `);
    } else {
        document.getElementById('personalizationMessage').innerHTML = `Thank you ${params.get('name')}! Fill your life with charm!`;
    }
}

//COOKIE STUFF
if(getCookie('user_cookie') != false) {
    user_cookie = getCookie('user_cookie');
} else {
    location.href = './login.html';
    window.stop;
}

document.getElementById('verify').innerHTML = `
    <p> Please verify that the information shown below is correct: </p>
    <p>Name: ${user_cookie['name']}</p>
    p>Email: ${user_cookie['email']}</p>
`;

let subtotal = 0;

for (let products_key in shopping_cart) {
    for (let i in shopping_cart[products_key]) {
        let qty = shopping_cart[products_key][i];
        if (qty == 0 || qty == '') continue;

        extended_price = qty * products[products_key][i].price.toFixed(2);
        subtotal += Number(extended_price);

        document.querySelector('#invoiceTable').innerHTML += `
        <tr style="border: none;">
            <td width="10%"><img src="${products[products_key][i].image}" alt="${products[products_key][i].alt}" style="border-radius: 5px;"></td>
            <td>${products[products_key][i].brand}</td>
            <td>${qty}</td>
            <td>${products[products_key][i].qty_available - qty}</td>
            <td>$${products[products_key][i].price.toFixed(2)}</td>
            <td>$${extended_price}</td>
        </tr>
    `;

    }
}

// Sales tax
let tax_rate = (4.7/100);
let tax_amt = subtotal * tax_rate;

// Shipping
if (subtotal < 300) {
    shipping = 5;
    shipping_display = `$${shipping.toFixed(2)}`;
    total = Number(tax_amt + subtotal + shipping);
}
else if (subtotal >= 300 && subtotal < 500) {
    shipping = 10;
    shipping_display = `$${shipping.toFixed(2)}`;
    total = Number(tax_amt + subtotal + shipping);
}
else {
    shipping = 0;
    shipping_display = 'FREE';
    total = Number(tax_amt + subtotal + shipping);
}

document.querySelector('#total_display').innerHTML += `
    <tr style="border-top: 2px solid black;">
        <td colspan="5" style="text-align:center;">Sub-total</td>
        <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Tax @ ${Number(tax_rate) * 100}%</td>
        <td>$${tax_amt.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Shipping</td>
        <td>${shipping_display}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;"><b>Total</td>
        <td><b>$${total.toFixed(2)}</td>
    </tr>
`;