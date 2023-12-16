const express = require('express');
const app = express();

//ASSIGNMENT 3
const session = require('express-sesson');
app.use(session({secret: "myNotSoSecretKey", resave: true, saveUninitialized: true}));
const cookieParser = require('cookie-parser');
const {request} = require('http');
app.use(cookieParser());

const qs = require('querystring');

// Middleware to log all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
        if (typeof request.session.cart == 'undefined') { request.session.cart = {}; } 

        if (typeof request.session.users == 'undefined') {request.session.users = Object.keys(status).length;}

    next();
});

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
//app.use(myParser.urlencoded({ extended: true }));

app.use(function (request, response, next) {
    if(request.path != "/products_display.html") { return next();}
      if(typeof request.query['Submit'] != 'undefined') {
        let tmp = request.query;
        delete tmp["Submit"];
        request.session.cart = tmp;
      }
    
      if(typeof request.session.cart != 'undefined') {
        request.query = Object.assign(request.query, request.session.cart);
      }
    
      request.path=`${request.path}?${qs.stringify(request.query)}`;
      console.log('session:',request.session);
      return next();
    });


// Load product data
const products = require(__dirname + '/products.json');
for (let category in products) {
    products[category].forEach((prod, i) => {prod.qty_sold = 0});
}
 
// Route for handling a GET request to "./products.js"
app.get('/products.js', function (request, response, next) {
    response.type('.js');
    let products_str = `let products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

app.get("/get_cart", function (request, response) {
    response.json(request.session.cart);
});


//ASSIGNMENT 2
// Read and parse user data
let user_data;
let status = {};

const fs = require('fs');
const filename = __dirname + '/user_data.json';


if (fs.existsSync(filename)) {
    let data = fs.readFileSync(filename, 'utf-8');
    user_data = JSON.parse(data);
    console.log(user_data);
    //let user_data_stats = fs.statSync(filename);
    //let stats_size = user_data_stats.size;
    //console.log(`The filename ${filename} has ${stats_size} characters`);
} else {
    console.log(`The file name ${filename} does not exist.`);
    user_data = {};
}

let temp_user = {};

 //sals pdpsp html
app.post("/process_form", function(request, response) {
    let POST = request.body;
    let has_qty = false;
    let errorObject = {};

    for (let i in products) {
        let qty = POST[`qty${[i]}`];
        has_qty = has_qty || (qty > 0);

        let errorMessages = validateQuantity(qty, products[i].qty_available);

        if (errorMessages.length > 0) {
            errorObject[`qty${[i]}_error`] = errorMessages.join(', ');
        }
    }
    if (has_qty == false && Object.keys(errorObject).length == 0) {
        response.redirect("./pd1.html?error");
    }
    else if (has_qty == true && Object.keys(errorObject).length == 0) {
        for (let i in products) {
            temp_user[`qty${i}`] = POST[`qty${[i]}`];

        }
        let params = new URLSearchParams(temp_user);
        response.redirect(`./login.html?${params.toString()}`);
    }
    else if (Object.keys(errorObject).length > 0) {
        response.redirect("./pd1.html?" + qs.stringify(POST) + `&inputErr`);
    }
 });


//sals login
app.post('/process_login', function(request, response) {
    let POST = request.body; 
    let entered_email = POST['email'].toLowerCase();
    let entered_password = POST['password'];

    if(entered_email.length == 0 && entered_password == 0) {
        request.query.loginErr = 'Email address & password are both required.'
    } else if (user_data[entered_email]) {
        if (user_data[entered_email].password == entered_password) {
            if (user_data[entered_email].status == false) {
                user_data[entered.email].status = true;
            status[entered_email] = true;
            }

            let user_cookie = {"email": entered_email, "name": user_data[entered_email]['name']};

            response.cookie('user_cookie', JSON.stringify(user_cookie), {maxAge: 900 * 1000});
            console.log(user_cookie);

            //see active users
            request.session.users = Object.keys(status).length;
            console.log(`Current users: $Object.keys(status).length} - ${Object.keys(status)}`)

            fs.writeFile(__dirname + filename, JSON.stringify(user_data), 'utf-8', (err) => {
                if(err) throw err;
                console.log('User data has been updated!');
            });

            response.redirect('/cart.html?');
            return;

        } else if  (entered_password.length == 0) {
            request.query.loginErr = 'Password cannot be blank.';
        } else {
            request.query.loginErr = 'Incorrect password.';
        } 
    } else {
        request.query.loginErr = 'Invalid email.';
    }
    
    request.query.email = entered_email;
    let params = new URLSearchParams(request.query);
    response.redirect(`./login.html?${params.toString()}`);

});

// Store registration erros; assume no errors at first
let registration_errors = {};

app.post('/register', function(request, response) {
	// Get user's inputs from registration form
	let reg_name = request.body.name;
	let reg_email = request.body.email.toLowerCase();
	let reg_password = request.body.password;
	let reg_confirm_passwaord = request.body.confirm_password;

	// Server response
	if (Object.keys(registration_errors).length == 0) {
		// Make a new object in the user_data object
		user_data[reg_email] = {
            "name": reg_name,
            "password": reg_password,
            "status": true
        };

		// Asynchronously write the updated user_data and products to their respective files
        fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (err) => {
			if (err) {
				console.error('Error updating user data:', err);
				// You may want to send an error response to the user or handle it differently
			} else {
				console.log('User data has been updated!');

				status[reg_email]=true;
				
				response.redirect(`/login.html`);
			}
		}); 
	}
	else {
		delete request.body.password;
		delete request.body.confirm_password;
	
		let params = new URLSearchParams(request.body);
		response.redirect(`/register.html?${params.toString()}&${qs.stringify(registration_errors)}`);
	}
})

function validateConfirmPassword(confirm_password, password) {
	// Reset previous errors
    delete registration_errors['confirm_password_type'];
    
    console.log(registration_errors);

    if (confirm_password !== password) {
		registration_errors['confirm_password_type'] = 'Passwords do not match.';
	}
}

// Function to validate quantity
function validateQuantity(quantity, availableQuantity) {
    let errors = []; // initialize array to hold error messages
    quantity = Number(quantity); // convert qty to a number

    switch (true) {
        case isNaN(quantity) || quantity === '':
            errors.push("Not a number. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Negative inventory and not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0:
            errors.push("Negative inventory. Please enter a non-negative quantity to order.");
            break;
        case quantity !== 0 && !Number.isInteger(quantity):
            errors.push("Not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity > availableQuantity:
            errors.push(`We do not have ${quantity} available.`);
            break;
    }

    return errors; // Add this line to return the array of errors
}
 
app.get('/get_products_data', function (request, response) {
    response.json(products_data);
  });
 
app.get('/add_to_cart', function (request, response) {
    let POST = request.body
    let products_key = POST['products_key'];
    let errorObject = {};

    for (let i in products[products_key]) {
        let qty = POST[`qty${[i]}`];
        let errorMessages = validateQuantity(qty, products[products_key][i].qty_available);
        if (errorMessages.length > 0) {
            errorObject[`qty${[i]}_error`] = errorMessages.join(', ');
        }
        console.log('error messages are:' + errorMessages);
    }

    console.log("errorObject = " + Object.keys(errorObject) + "" + Object.keys(errorObject).length);

    if (Object.keys(errorObject).length == 0) {
        if (!request.session.cart) {
            request.session.cart = {};
        }
        if (typeof request.session.cary[products_key] == 'undefined') {
            request.session.cart[products_key] = [];
        }
        let user_qty = [];

        for (let i in products[products_key]) {
            user_qty.push(Number(POST[`qty${i}`]));
        }

        request.session.cart[products_key] = user = qty;
        response.redirect(`/products_display.html?products_key=${POST['products_key']}`);
    }

    else if (Object.keys(errorObject).length > 0) {
        response.redirect(`/products_display.html?${qs.stringify(POST)}$inputErr`);
    }
})

app.post('update_shopping_cart', function (request, response) {
    let POST = request.body;

    let products_key = POST['products_key'];

    for (products_key in request.session.cart) {
        for (let i in request.session.cart[products_key]) {
            request.session.cart[products_key][i] = Number(request.body[`cartInput_${products_key}${i}`]);
        }
    }
    response.redirect('/cart.html');
})

app.post('/continue', function(request, response) {
    response.redirect(`/products_display.html?`);
})

app.get('/checkout', function (request, response) {
    if (typeof request.cookies['user_cookie'] == 'undefined') {
        response.redirect(`/login.html?`)
    } else {
        response.redirect(`/invoice.html?valid`);
    }
     
})

app.post('/complete_purchase', function(request, response) {
    let cookie = JSON.parse(request.cookies['user_cookie']);
    let email = cookie['email'];
    let subtotal = 0;
    let total = 0;

    let invoice_str = `
    Thank you for your order!
    <table>
        <thead>
        <tr>
        <th>Item</th>
        <th>Quantity Purchased</th>
        <th>Quantity Left</th>
        <th>Price</th>
        <th>Extended Price</th>
        </tr>
        </thead>
        <tbody>
    `;

    let shopping_cart = request.session.cart;

    for (let products_key in products) {
        for (let i in products[products_key]) {
            if (typeof shopping_cart[products_key] == 'undefined') continue;

            let qty = shopping_cart[products_key][i];

            products[products_key][i].qty_sold += Number(qty);
            products[products_key][i].qty_available -= Number(qty) || 0;
        }
    }

    fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (err) => {
        if (err) {
            console.error('Error updating products data:', err);
        } else {
            console.log('Products data has been updated!');
        }
    });

    for (let products_key in products) {
        for (let i in products[products_key]) {
            if (typeof shopping_cart[products_key] == 'undefined') continue;

            let qty = shopping_cart[products_key][i];
            if (qty > 0) {
                let extended_price = qty * products[products_key][i].price;
                subtotal += extended_price;
                invoice_str += `
                <tr>
                    <td>${products[products_key][i].name}</td>
                    <td>${qty}</td>
                    <td>${products[products_key][i].qty_available - qty}</td>
                    <td>${products[products_key][i].price.toFixed(2)}</td>
                    <td>${extended_price}</td>
                </tr>
                `;
            }
        }
    }

    let tax_rate = (4.7/100);
    let tax_amt = subtotal * tax_rate;

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

    invoice_str += `
        <tr style="border-top: 2px solid black;">
            <td colspan="4" style="text-align:center;">Sub-total</td>
            <td>$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:center;">Tax @ ${Number(tax_rate) *100}%</td>
            <td>$${tax_amt.toFixed(2)}</td>
        </tr>
        <tr style="border-top: 2px solid black;">
            <td colspan="4" style="text-align:center;">Shipping</td>
            <td>$${shipping_display}</td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:center;">Total</td>
            <td>$${total.toFixed(2)}</td>
        </tr>
        </tbody>
        </table>
    `;

    request.session.destroy();
    response.send(invoice_str);
})

app.post('/process_logout', function(request, response) {
    let cookie = JSON.parse(request.cookies['user_cookie']);
    let email = cookie['email'];

    if (user_data[email] && user_data[email].status == true) {
        delete status[email];
        user_data[email].status = false;
        response.clearCookie("user_cookie");
        request.session.users = Object.keys(status).length;

        fs. writeFile(filename, JSON.stringify(user_data), 'utf-8', (err) => {
            if (err) {
                console.error('Error updating user data:', err);
            } else {
                console.log('User data has been updated!');
                console.log(user_data);
                console.log(`User with email ${email} was successfully logged out`);
                response.redirect('/index.html?');
            }
        });
    } else {
        console.log(user_data);
        console.log(status);
        console.log(`User with email ${email} not found or is already logged out.`);
        response.redirect('/index.html?');
    }
})

// Server listening on port 8080
app.listen(8080, () => console.log(`Listening on port 8080`));