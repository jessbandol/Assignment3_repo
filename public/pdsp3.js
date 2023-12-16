// Get the URL
let params = (new URL(document.location)).searchParams;

//define objects representing a product with brand, price, and image information
const product1 = {
    brand: "oval clip",
    price: 3.10,
    image: "./images/ovalclip.png",
    quantity_available: 100,
};

const product2 = {
    brand: "alligator clip",
    price: 2.10,
    image: "./images/alligator.png",
    quantity_available: 100
};

const product3 = {
    brand: "mini clip",
    price: 2.05,
    image: "./images/miniclip.png",
    quantity_available: 100
};

const product4 = {
    brand: "tweezer",
    price: 2.00,
    image: "./images/tweezer.png",
    quantity_available: 100
};

const product5 = {
    brand: "small screw",
    price: 2.50,
    image: "./images/smallscrew.png",
    quantity_available: 100
};

const product6 = {
    brand: "earring hook",
    price: 2.50,
    image: "./images/earrings.png",
    quantity_available: 100
};

//POKE9 array
const products = [product1, product2, product3, product4, product5, product6];

//extended price
let subtotal = 0;
let taxRate = 0.0575;
let taxAmount = 0;
let total = 0;
let shippingCharge = 0;


// for loop (generates product sections with quantity input and error messages for each product in the array)
for (let i = 0; i < products.length; i++) {
    document.querySelector('.main').innerHTML += `
    <section class="item">
        <h2>${products[i].brand}</h2>
        <p>In Stock: <span style="text-decoration: underline; color: orange; display: inline-block; margin-bottom: 15px">${products[i].quantity_available}</span></p>
        <p>Sold: <span style="text-decoration: underline; color: orange; display: inline-block; margin-bottom: 15px">${products[i].total_sold}</span></p>
        <p>$${products[i].price.toFixed(2)}</p>
        <img src="${products[i].image}"/>
        
        <div class="quantity-selector">
            <button type="button" class="qtyButton highlight" onclick="document.getElementById('qty${[i]}_entered').value--; checkInputTextbox(document.getElementById('qty${[i]}_entered'), ${products[i].qty_available});">-</button>
            <input type="text" autocomplete="off" placeholder="0" name="qty${[i]}" id="qty${[i]}_entered" class="inputBox" onkeyup="checkInputTextbox(this,${products[i].qty_available})">
            <button type="button" class="qtyButton highlight" onclick="document.getElementById('qty${[i]}_entered').value++; checkInputTextbox(document.getElementById('qty${[i]}_entered'), ${products[i].qty_available});">+</button>
        </div>

        <div id="qty${[i]}_error" style="color: red;"></div>
    </section>`;
}


window.onload = function() {
    if (params.has('error')) {

        document.getElementById('errMsg').innerHTML = "No quantities selected.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);
    }
    else if (params.has('inputErr')) {
        document.getElementById('errMsg').innerHTML = "Please fix errors before proceeding.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);
        
        for (let i in products) {
            let qtyInput = qty_form[`qty${[i]}_entered`];
            let qtyError = document.getElementById(`qty${[i]}_error`);

            //set value from url parameters
            if (params.get(`qty${i}`) !== null) {
                qtyInput.value = params.get(`qty${i}`);
            }

            //validate quantity & display errors 
            let errorMessages = validateQuantity(qtyInput.value, products[i].qty_available);
            if (errorMessages.length > 0) {
                qtyError.innerHTML = errorMessages.join('<br>');
                qtyInput.parentElement.style.borderColor = "red";
            } else {
                qtyError.innerHTML = "";
                qtyInput.parentElement.style.borderColor = "black";
            }
        }
    }
    if (params.has('name')) {
        document.getElementById('WelcomeMsg').innerHTML = `Thank you ${name}! You are the most charming!`;
        for (let i in products) {
            qty_form[`qty${i}`].value = params.get(`qty${i}`);
        }
    }
}


//validation errors
function validateQuantity(quantity, availableQuantity) {
    let errors = []; // Initialize an array to hold error messages

    quantity=Number(quantity);

    switch (true) {
        case (isNaN(quantity)) && (quantity != ''):
            errors.push("Not a number. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Negative inventory and not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0:
            errors.push("Negative inventory. Please enter a non-negative quantity to order.");
            break;
        case quantity !=0 && !Number.isInteger(quantity):
            errors.push("Not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity > availableQuantity:
            errors.push(`We do not have ${quantity} available.`);
            break;
        
    }

    return errors; 
};


//quantity textbox check
function checkInputTextbox(textBox, availableQuantity) {
    let str = String(textBox.value);

    // Check if the first character is '0' and remove it if found
    if (str.charAt(0) == '0') {
        textBox.value = Number(str.slice(0, 0) + str.slice(1, str.length));
    }

    // Convert the input value to a number
    let inputValue = Number(textBox.value);

    // Validate the user input quantity using the updated validateQuantity function
    let errorMessages = validateQuantity(inputValue, availableQuantity);

    // Check if there are any error messages and update the display
    let errorDisplay = document.getElementById(textBox.name + '_error');
    if (errorMessages.length > 0) {
        errorDisplay.innerHTML = errorMessages.join('<br>');
        errorDisplay.style.color = "red";
        textBox.parentElement.style.borderColor = "red";
    } else {
        errorDisplay.innerHTML = "";
        textBox.parentElement.style.borderColor = "black";
    }
    
}