function init(){
    console.log('Initializing document');
    getProducts();
    console.log(JSON.parse(sessionStorage.products))
    var productsUncoverted = sessionStorage.products
    var products = JSON.parse(productsUncoverted);
    var tableBody = document.getElementById('tableBody')
    products.forEach(product => {
        tr =document.createElement('tr')
        tdCode =document.createElement('td')
        tdName =document.createElement('td')
        tdPrice =document.createElement('td')
        tdQuantity =document.createElement('td')
        tdDepartament =document.createElement('td')

        //inner data
        tdCode.innerHTML = product.code;
        tdName.innerHTML = product.name;
        tdPrice.innerHTML = product.price;
        tdQuantity.innerHTML = product.stock;
        product.department.forEach(department => {
            tdDepartament.innerHTML = department.name;
        });
        tr.appendChild(tdCode);
        tr.appendChild(tdName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdQuantity);
        tr.appendChild(tdDepartament);
        tableBody.appendChild(tr);
    });

}

//Get all the products from the data base
function getProducts(){
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllProducts.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            sessionStorage.products = x.responseText;
        }
        
    }

}