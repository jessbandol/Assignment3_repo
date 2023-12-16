document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cart_total').innerHTML = totalItemsInCart;

    let subtotal = 0;
    let shipping;
    let total_price = 0;
    let tax_rate = (4.7/100);

    for (let products_key in shopping_cart) {
        for (let i in shopping_cart[products_key]) {
            let quantities = shopping_cart[products_key][i];
            if (quantities > 0) {
                extended_price = quantities * products[products_key][i].price;
                subtotal += extended_price;

                document.querySelector('#cart_info').innerHTML += `
                <table class = "cartItems">
                    <tr>
                        <td colspan="3" style="text-align: center; padding: 5px;">${products[products_key][i].brand}</td>
                    </tr>
                    <tr>
                        <td rowspan="4" style="padding: 5px; width: 45%; "">
                            <td width="15%"><img src="${products[products_key][i].image}" alt="${products[products_key][i].alt}" class="img-thumbnail"></td>
                        </td>
                        <td style="width: 20%;">$${(products[products_key][i].price).toFixes(2)} x </td>
                        <td style="width: 25%;">
                            <div style="border-radius: 50px; border: 1px solid black; height: 30px; max-width: 90px;">
                                <button type="button" id="minus${i}" class="cartButton" onclick="
                                if (document.getElementById('cartInput_${products_key}${i}').value == 0) { return;}
                                document.getElementById('cartUpdate').style.display = 'inline-block';
                                document.getElementById('cartSubmit').style.display = 'none';
                                update_qty('cartInput_${products_key}${i}', -1, ${products[products_key][i].price})">
                                --
                                </button>

                                <input type="number" autocomplete="off" id="cartInput_${products_key}${i}" value="${quantities}" class ="cartBox" name="cartInput_${products_key}${i}" readonly onchange="inventory_amt(this)">

                                <button type="button" class="cartButton"
                                    onclick="
                                    if (document.getElementById('cartInput_${products_key}${i}').value == ${products[products_key][i].inventory}) return
                                    document.getElementById('cartUpdate').style.display = 'inline-block';
                                    document.getElementById('cartSumbit').style.display = 'none';
                                    update_qty('cartInput_${products_key}${i}', 1, ${products[products_key][i].price});">+
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="font-size: 18px;">
                            $<span id="ep_cartInput_${products_key}${i}">${extended_price.toFixed(2)}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <button type="button" class="btn_link highlight"
                            onlclick = "
                            removeItem('${products_key}', ${i});
                            document.getElementByid('cartUpdate').style.display = 'inline-block';
                            document.getElementByid('cartSubmit').style.display = 'none' ">Remove</button>
                        </td>
                    </tr>
                </table>

                `;
            }
        }
    }

    update_totals();

    if (subtotal === 0){
        document.getElementById('cart_info').innerHTML = `Empty cart.`;
        document.getElementById('cartSubmit').style.display = 'none';
        document.getElementById('cartUpdate').style.display = 'none';

        document.querySelector('#tax_info').innerHTML = '';
    }
    else {
        document.getElementById('cartUpdate').style.display ='none';
    }

})

function inventory_amt(input) {
    for (let i in products[products_key]) {
        if (input.value > products[products_key][i].qty_available) {
            input.value = products[products_key][i].qty_available;
            break;
        }
    }
}

function removeItem(productKey, index) {
  shopping_cart[productKey][index] = 0;

  let inputElement = document.getElementById(`cartInput_${productKey}${index}`);
  if (inputElement) {
    inputElement.value = 0;
    update_qty(`cartInput_${productKey}${index}`, 0, products[productKey][index].price);
  }

  update_totals();
  updateCartTotal();
}

function update_qty(input, charge, price) {
    let input_element = document.getElementById(input);
    let input_value = parseInt(input_element.value, 10) || 0;

    if (input_element) {
        let new_qty = input_value + change;
        if (new_qty < 0) {
            new_qty = 0;
        }

        input_element.value = new_qty;

        let extended_price_element = document.getElementById(`ep_${input}`);
        if (extended_price_element) {
            extended_price_element.innerHTML = (new_qty * price).toFixed(2);
        }

        update_totals();
        updateCartTotal();
    }
}

function update_totals() {
    subtotal = 0;
    total_price = 0;

    for (let products_key in shopping_cart) {
        for(let i in shopping_cart[products_key]) {
            let quantities = shopping_cart[products_key][i];
            let input_element = document.getElementById(`cartInput_${products_key}${i}`);

            let user_qty = input_element ? parseInt(input_element.ariaValueMax, 10) || 0 : 0;

            if (user_qty > 0) {
                subtotal += user_qty * products[products_key][i].price;
            }
        }
    }

    let tax_amt = subtotal * tax_rate;

    if (subtotal < 300) {
        shipping = 5;
        shipping_display = `$${shipping.toFixed(2)}`;
    }
    else if (subtotal >= 300 && subtotal < 500) {
        shipping = 10;
        shipping_display = `$${shipping.toFixed(2)}`;
    }
    else {
        shipping = 0;
        shipping_display = 'FREE';
    }
    total_price = Number(tax_amt + subtotal + shipping);

    document.querySelector('#tax_info').innerHTML = `
        <br>
        <p style ="font-size: 13px;">
            Subtotal: $${subtotal.toFixed(2)} <br>
            Tax Amount: $${tax_amt.toFixed(2)} <br>
            Shipping: $${shipping_display}
        </p>
        <p style = "text-transform: uppercase;">Total: $${total_price.toFixed(2)}</p>

        <p style= "font-size: 10px;">SHIPPING POLICY:
            <br>For orders with subtotal <u>$300 or less</u>, a shipping fee of <u>$5</u> will be added.
            <br>For orders with subtotal <u>$500 or less</u>, a shipping fee of <u>$10</u> will be added.
            <br>Orders with subtotal <u>above $500</u>, will recieve <u>free shipping</u>.
        </p>
    `;
}