function loadJSON(service, callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function nav_bar(products_key, products) {
    for (let products_key in products) {
        document.write(`<a class="nav-link mx-3 highlight" href='/products_display.html?products_key=${products_key}'>${products_key}</a>`);
    }
}