//import { itemData } from "./products.js";
// Extract quantity values from the URL and assign to the quantity array based on the item indexes in the quantityIndex of the itemData array
let params = (new URL(document.location)).searchParams;

/*
const products = [
    {
      "brand": "Puffy Pinks",
      "price": 5.20,
      "image": "./images/Puffy Pinks.jpeg",
      "qty_available": 100,
      "qty_sold": 0
    },
    {
      "brand": "Sun Gold",
      "price": 5.20,
      "image": "./images/Sun Gold.png",
      "qty_available": 100,
      "qty_sold": 0
    },
    {
      "brand": "Candyfloss",
      "price": 6.10,
      "image": "./images/Candyfloss.png",
      "qty_available": 100,
      "qty_sold": 0
    },
    {
      "brand": "Bubbles",
      "price": 4.15,
      "image": "./images/Bubbles.png",
      "qty_available": 100,
      "qty_sold": 0
    },
    {
      "brand": "Lucky Stars",
      "price": 6.10,
      "image": "./images/Lucky Stars.png",
      "qty_available": 100,
      "qty_sold": 0
    } 
  ];
*/

window.onload = function() {
    if (!params.has('name') || !params.has('valid')) {
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

let subtotal = 0;
//extended price
let taxRate = 0.0575;
let taxAmount = 0;
let total = 0;
let shippingCharge = 0;

let qty = [];
for (let i in products) {
    qty.push(params.get(`qty${i}`));
}

for (let i in qty) {
    if (qty[i] == 0 || qty[i] == '') continue;

    extended_price = (params.get(`qty${i}`) * products[i].price).toFixed(2);
    subtotal += Number(extended_price);

    document.querySelector('#invoiceTable').innerHTML += `
        <tr style="border: none;">
            <td width="10%"><img src="${products[i].image}" style="border-radius: 5px;"></td>
            <td>${products[i].brand}</td>
            <td>${qty[i]}</td>
            <td>${products[i].qty_available}</td>
            <td>$${products[i].price.toFixed(2)}</td>
            <td>$${extended_price}</td>
        </tr>
    `;
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

/*/
for (let i = 0; i < itemData.length; i++) {
    let quantityValue = params.get(`quantity${i}`);
    if (quantityValue !== null) {
        quantity[itemData[i].quantityIndex] = Number(quantityValue);
    }
}
*/

/*
// Inventory object with initial quantities
const inventory = {
    "puffy pinks": 100,
    "sun gold": 100,
    "candyfloss": 100,
    "bubbles": 100,
    "lucky stars": 100,
};
*/

/*
//extended price
let subtotal = 0;
let taxRate = 0.0575;
let taxAmount = 0;
let total = 0;
let shippingCharge = 0;

generateItemRows();

if (subtotal <= 50) {
    shippingCharge = 2;
} else if (subtotal <= 100) {
    shippingCharge = 5;
} else {
    shippingCharge = subtotal *0.05;
}

//total calculation
taxAmount = subtotal*taxRate;
total = subtotal + taxAmount + shippingCharge;

//bold total
document.getElementById('total_cell').innerHTML = `$${total.toFixed(2)}`;

//set cells
document.getElementById('subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
document.getElementById('tax_cell').innerHTML = '$' + taxAmount.toFixed(2);
document.getElementById('shipping_cell').innerHTML = '$' + shippingCharge.toFixed(2);
*/

/*
// Retrieve selected quantities from local storage
const selectedQuantities = JSON.parse(localStorage.getItem('selectedQuantities'));

// Check if there are selected quantities
if (selectedQuantities) {
    // Display selected quantities on the invoice page
    for (const [key, value] of Object.entries(selectedQuantities)) {
        const quantityInput = document.getElementById(key);
        if (quantityInput) {
            quantityInput.value = value;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const isValid = urlParams.has('valid');
    
    if (isValid) {
        // Extract and display selected quantities
        const selectedQuantities = urlParams.getAll('qty');
        // Use the selected quantities to update your HTML elements
        updateInvoice(selectedQuantities);
    }
});

function updateInvoice(selectedQuantities) {
    console.log('Updating invoice with quantities:', selectedQuantities);

    // Display selected quantities on the invoice page
    for (let i = 0; i < selectedQuantities.length; i++) {
        const quantityInput = document.getElementById(`quantity${i}`);
        if (quantityInput) {
            quantityInput.value = selectedQuantities[i];
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve additional data from the server if necessary
    // Example: Fetching user information associated with the purchase
    fetch('/api/user-data')
      .then(response => response.json())
      .then(userData => {
        console.log('User Data:', userData);
        // Use the data to update the HTML or perform other actions
      })
      .catch(error => {
        console.error('Error fetching user data:', error.message);
      });
  });

//validate quantity inputted into the textbox 
function validateQuantity(brand, quantity) {
    const availableInventory = inventory[brand];

    if (isNaN(quantity)) {
        // Display error message in bold and red
        return `<span style="color: red; font-weight: bold;">Not a number</span>`;
    } else if (quantity < 0) {
        // Display error message in bold and red
        return `<span style="color: red; font-weight: bold;">Negative quantity</span>`;
    } else if (!Number.isInteger(quantity)) {
        // Display error message in bold and red
        return `<span style="color: red; font-weight: bold;">Not an Integer</span>`;
    } else if (quantity > availableInventory) {
        // Display error message in bold and red
        return `<span style="color: red; font-weight: bold;">Only ${availableInventory} ${brand} available</span>`;
    } else {
        // Update inventory for valid quantity
        inventory[brand] -= quantity;
        return "";
    }
}


window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const isValid = urlParams.has('valid');

    if (isValid) {
        // Fetch user data
        fetch('/api/user-data')
            .then(response => response.json())
            .then(userData => {
                // Show the invoice
                generateInvoice();

                // Populate personalization message with the username
                const username = userData.username; // Adjust this based on your actual user data structure
                const personalizationMessage = `Welcome back, ${username}!`;
                document.getElementById('personalizationMessage').innerText = personalizationMessage;
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
    }
};

// Add event listeners for the buttons
document.addEventListener('DOMContentLoaded', function () {
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const finishShoppingBtn = document.getElementById('finishShoppingBtn');

    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function () {
            // Handle the 'Continue Shopping' button click
            fetch('/continue_shopping', { method: 'POST' })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
        });
    }

    if (finishShoppingBtn) {
        finishShoppingBtn.addEventListener('click', function () {
            // Handle the 'Finish Shopping' button click
            fetch('/purchase_logout', { method: 'POST' })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
        });
    }
});
*/

/*
// Item rows (generate the entire invoice table)
function generateItemRows() {
    let table = document.getElementById('invoiceTable');
    table.innerHTML = '';
    let hasErrors = false;
    for (let i = 0; i < itemData.length; i++) {
        let item = itemData[i];
        let itemQuantity = quantity[item.quantityIndex];
        let validationMessage = validateQuantity(item.brand, itemQuantity);

        if (validationMessage !== "") {
            hasErrors = true;
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<span style="font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 22px;">${item.brand}</span>`;
            row.insertCell(1).innerHTML = validationMessage;
        } else if (itemQuantity > 0) {
            let extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<span style="font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 22px;">${item.brand}</span>`;
            row.insertCell(1).innerHTML = itemQuantity;
            row.insertCell(2).innerHTML = '$' + item.price.toFixed(2);
            row.insertCell(3).innerHTML = '$' + extendedPrice.toFixed(2);
        }
    }
    if (!hasErrors) {
        document.getElementById('total_cell').innerHTML = '$' + total.toFixed(2);
    }
}
*/