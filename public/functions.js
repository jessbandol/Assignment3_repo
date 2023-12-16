function loadJSON(service, callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

//chatgpt
function nav_bar(selectedProductsKey, products) {
    for (let category of Object.keys(products)) {
        document.write(`
            <a class="nav-link mx-3 highlight" href='/products_display.html?products_key=${category}' style="font-weight: ${category === selectedProductsKey ? 'bold' : 'normal'};">
                ${category}
            </a>
        `);
    }
}