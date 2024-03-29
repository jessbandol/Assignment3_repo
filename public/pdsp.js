//ADDING PRODUCTS
for (let i in products[products_key]) {
    document.querySelector('.row').innerHTML += `
        <div class="col-md-6 product_card" style="margin-bottom: 40px; padding: 15px;">
            <div>
                <h2 style="float: left;" class="product_name">${products[products_key][i].brand}</h2>
                <h2 style="float: right;">$${(products[products_key][i].price).toFixed(2)}</h2>
            </div>
            <img src="${products[products_key][i].image}" style="width: 75%" class="img-thumbnail" alt="${products[products_key][i].alt}">
            <div style = "height: 90px;">
                <table style="width: 100%; text-align: center; font-size: 18px;" id="product_table">
                    <tr>
                        <td style = "text-align: left; width: 35%;">Available: ${products[products_key][i].qty_available}</td>

                        <td style = "text-align: center; width: 35%;" rowspan="2">
                            <div style="border-radius: 50px; border: 2px solid black; width: 70%; height: 40px; float: right;">
                                <button type="button" class ="qtyButton highlight" onclick="document.getElementById('qty${[i]}').value--; checkInputTextbox(qty${[i]});">-</button>

                                <input type-"text" autcomplete="off" placeholder="0" name="qty${[i]}" id="qty${[i]}" class="inputBox" onkeyup="checkInputTextbox(this)">

                                <button type="button" class ="qtyButton highlight" onclick="document.getElementById('qty${[i]}').value++; checkInputTextbox(qty${[i]});">+</button>
                            </div>
                            
                            <p id="qty${[i]}_label" style="margin: 6px ); float: right; padding-right: 10px;">Qty:</p>
                        </td>
                    </tr>
                    <tr>
                        <td style: "text-align: left; width: 35%;" id="qty_sold${i}">Sold: ${products[products_key][i].qty_sold}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding-top: 10px;">
                            <input type="submit" value="Add to cart" class="sm-button highlight">
                        </td>
                    </tr>
                    <tr>
                        <td colspan ="3" style="padding-top: 5px;"><div id="qty${[i]}_error"></div></td>
                    </tr>
                </table>
                </div>

                </div>
    `;
}

window.onload = function() {
    let params = (new URL(document.location)).searchParams;

    if (params.has('error')) {
        document.getElementById('errMsg').innerHTML = "No quantities selected.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 4000);
    }
    else if (params.has('inputErr')) {
        alert("input error");
        document.getElementById('errMsg').innerHTML = "Please fix errors before proceeding."
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 4000);

        for (let i in products[products_key]) {
            if (params.get(`qty${i}`) == 0) {
                qty_form[`qty${i}`].value = '';
            } else {
                qty_form[`qty${i}`].value = params.get(`qty${i}`);
                qty_form[`qty${i}`].parentElement.style.borderColor = "red";
            }
            errors = validateQuantity(params.get(`qty${i}`), products[products_key][i].qty_available);
            document.getElementById(`qty${i}_error`).innerHTML = errors.join('');
            alert(errors);
        }
    }

    if ((typeof shopping_cart[products_key] != 'undefined') && (params.has('inputErr') != true)) {
        for (let i in shopping_cart[products_key]) {
            if (shopping_cart[products_key][i] == 0) {
                document.getElementById(`qty${[i]}`).value = '';
            }
            else {
                document.getElementById(`qty${[i]}`).value = shopping_cart[products_key][i];
            }
        }
    }
}

//VALIDATION
function validateQuantity(quantity, availableQuantity) {
    let errors = [];

    quantity = Number(quantity);

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

//UPDATE INPUT TEXTBOX
function checkInputTextbox(textbox, availableQuantity) {
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
