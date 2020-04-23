function getQuerystring(key, default_) {
    if (default_ == null)
        default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&amp;]" + key + "=([^&amp;#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
}

function getProductsSale() {
    let sale = getQuerystring('sale', 1)
    x = new XMLHttpRequest();
    x.open('GET', 'http://localhost/Abarrotes/api/AllProducts_Sell.php?idSell=' + sale)
    x.send()
    x.onreadystatechange = function () {
        if (x.status == 200 && x.readyState == 4) {
            let products = JSON.parse(x.responseText)
            products.forEach(product => {
                addProduct(product)
            });
            let loader = document.getElementById('loader')
            loader.classList.remove('loader')
        }
    }
}

function addProduct(product) {

    let div_card = document.createElement('div'),
        div_card_header = document.createElement('div'),
        div_card_body = document.createElement('div'),
        h4 = document.createElement('h5'),
        wrapper = document.getElementById('wrapper'),
        price = document.createElement('h6'),
        quantity = document.createElement('h6'),
        subtotal = document.createElement('h6')
    //classes
    div_card.classList.add('card')
    div_card_header.classList.add('card-header')
    div_card_body.classList.add('card-body')
    //data
    h4.innerHTML = product.nameProduct
    price.innerHTML = '<strong>' + 'Precio : </strong> $' + product.priceProduct
    quantity.innerHTML = '<strong>' + 'Cantidad : </strong>' + parseInt(product.quantity)
    subtotal.innerHTML = '<strong>' + 'Subtotal : </strong> $' + product.subtotal


    //append 
    div_card_body.appendChild(price)
    div_card_body.appendChild(quantity)
    div_card_body.appendChild(subtotal)
    div_card_header.appendChild(h4)
    div_card.appendChild(div_card_header)
    div_card.appendChild(div_card_body)
    wrapper.appendChild(div_card)
}

function init() {
    getProductsSale()
}