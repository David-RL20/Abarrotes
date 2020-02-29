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

function init(){
    console.log('Initializing document');
    getSuppliers();

    var suppliersUnconverted = sessionStorage.suppliers
    var suppliers = JSON.parse(suppliersUnconverted);
    var tableBody = document.getElementById('tableBody')
    suppliers.forEach(product => {
        tr =document.createElement('tr')
        tdCode =document.createElement('td')
        tdName =document.createElement('td')
        tdPrice =document.createElement('td')
        tdQuantity =document.createElement('td')
        tdDepartament =document.createElement('td')

        tdButton = document.createElement('td')
        editButton = document.createElement('button')
        editImage = document.createElement('img')
        //src image
        editImage.src = '../../images/edit.png'
        //ids
        editImage.id= 'image'+product.code
        editButton.id='button'+ product.code;
        tdCode.id= 'code'+product.code
        tdName.id= 'name'+product.code
        tdPrice.id= 'price'+product.code
        tdQuantity.id= 'quantity'+product.code
        tdDepartament.id= 'department'+product.code
        
        editing = false;
        //onclick
        editButton.onclick = function(){
            buttonEdit = document.getElementById('button'+ product.code)
            imageButton = document.getElementById('image'+product.code)
            tdCode =document.getElementById('code'+product.code)
            tdName =document.getElementById('name'+product.code)
            tdPrice =document.getElementById('price'+product.code)
            tdQuantity =document.getElementById('quantity'+product.code)
            tdDepartament =document.getElementById('department'+product.code)
            
            //We click and begin editing
            if(!editing){   
                imageButton.src='../../images/save.png'
                var inputCode = document.createElement('input')
                var inputName = document.createElement('input')
                var inputPice = document.createElement('input')
                var inputQuantity = document.createElement('input')
                var inputDepartment = document.createElement('input')
            }
            else{
                //we click and begin saving
                if(editing){
                    imageButton.src = '../../images/edit.png'
                }
            }
            editing = !editing;
        }
        //inner data
        tdCode.innerHTML = product.code;
        tdName.innerHTML = product.name;
        tdPrice.innerHTML = product.price;
        tdQuantity.innerHTML = product.stock;
        editButton.appendChild(editImage);
        tdButton.appendChild(editButton)
        tr.appendChild(tdCode);
        tr.appendChild(tdName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdQuantity);
        tr.appendChild(tdDepartament);
        tr.appendChild(tdButton);
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