function init(){
    console.log('Initializing document');
    getSuppliers();
    console.log(JSON.parse(sessionStorage.suppliers))
    var productsUncoverted = sessionStorage.suppliers
    var suppliers = JSON.parse(productsUncoverted);
    var tableBody = document.getElementById('tableBody')
    suppliers.forEach(supplier => {
        tr =document.createElement('tr')
        tdNum =document.createElement('td')
        tdName =document.createElement('td')
        tdDelivery =document.createElement('td')
        tdOrder =document.createElement('td')

        //inner data
        tdNum.innerHTML = supplier.number;
        tdName.innerHTML = supplier.name;
        tdDelivery.innerHTML = supplier.deliveryDay;
        tdOrder.innerHTML = supplier.orderDay;

        tr.appendChild(tdNum);
        tr.appendChild(tdName);
        tr.appendChild(tdDelivery);
        tr.appendChild(tdOrder);

        tableBody.appendChild(tr);
    });

}

//Get all the products from the data base
function getSuppliers(){
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllSuppliers.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            sessionStorage.suppliers = x.responseText;
        }
        
    }

}