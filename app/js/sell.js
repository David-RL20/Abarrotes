//Constants like inputs, URLs, etc...
const idInputCode = "inputCodeProduct";
const idDataList = "dataListProducts";
const idTableBody = "tableBody";
const idTotalCurrentLabel = "totalCurrently";
const AllProductsURL = "http://localhost/Abarrotes/api/AllProducts.php"
const cartURL = "http://localhost/Abarrotes/api/api-car.php"
var AllProducts = JSON.parse(sessionStorage.products)

//Executes every time the page is refresh
function init(){
    // getProducts();
    // // sessionStorage.articleSelected = undefined;
    // infoInput = document.getElementById(idInputCode);
    // infoInput.focus();
    // infoInput.addEventListener("keypress",function(){
    //     if(event.keyCode == '13'){
    //         if(infoInput.value != ''){
    //             var array = moreProducts(infoInput.value);
    //             if(typeof array !== 'undefined')
    //                 addToTable(array[0],array[1]);
    //             else 
    //                 addToTable(infoInput.value)

    //             infoInput.focus();
    //             infoInput.value='';
    //         }
    //         else{
    //             abrirPopUp();
    //         }
    //     }
    // });
    showCart();
    
}


// //Get all the products from the data base
// function getProducts(){
//     // Ask for all the products
//     x= new XMLHttpRequest();
//     x.open('GET',AllProductsURL)
//     x.send()
//     x.onreadystatechange = function(){
//         if(x.status == 200 && x.readyState == 4){
//             sessionStorage.products = x.responseText;
//             addProductsToDataList(JSON.parse(sessionStorage.products))
//         }
        
//     }

// }
// //ADD the products to the data list
// function addProductsToDataList(products){

//     var dataList = document.getElementById(idDataList);
//     products.forEach(product => {
//         var option = document.createElement('option');
//         option.value = product.code;
//         // option.className="list-group-item";
//         option.innerHTML = product.name;
//         dataList.appendChild(option);
//     });

// }

// //Search in database for the code of the product 
// //and add all its data 
// function addToTable(code , quantity){
    
//     products = JSON.parse(sessionStorage.products)
//     var found = false;
    
//     products.forEach(product => {
//         if(product.code == code){
//             found=true;
//             var existing = verifyIsInTable(code, quantity);
//             if(!existing){
                
//             }
//         }
//     });

//     if(!found){
//         alert('Producto invalido');
//         infoInput = document.getElementById(idInputCode);
//         infoInput.value='';
//         infoInput.focus();
        
//     }
// }
// //returns and array (code,quantity) if there is a "*"
// function moreProducts(text){
//     var stringInput = document.getElementById(idInputCode)
//     string = text;
//     position = string.indexOf("*");
//     if(position != -1){
//         totalProducts = string[position];
//         quantity = string.slice(0,position);
//         if(quantity.match(/[a-z]/i)){
//             alert('Cantidad equivocada');
//             stringInput.value=''
//             stringInput.focus();
//         }
//         productCode = string.slice(position + 1,string.length)
//         if(productCode.match(/[a-z]/i)){
//             alert('El codigo del producto no deber contener letras');
//             stringInput.value=''
//             stringInput.focus();
//         }
//         error = false;
//         //validates if it has more than one *
//         for(var i = 1; i< productCode.length;i++){
//             if(productCode[i] == '*'){
//                 error=true;
//             }
//         }
//         if(error){
//             alert('Error De Cantidad, Demasiados ** ')
//             stringInput.value=''
//             stringInput.focus();
//         }
//         return Array(productCode,quantity) 
//     }
//     else
//         return undefined
// }

// function verifyIsInTable(code , quantity){
//     found = false;
//     try {
//         tdCode =document.getElementById('code'+code)
//         tdQuantity = document.getElementById('quantity'+code);
//         tdPrice = document.getElementById('price'+code);
//         tdTotal = document.getElementById('total'+code);
//         totalAmount =document.getElementById(idTotalCurrentLabel);
//         if(totalAmount.textContent !='')
//         totalCurrent = parseFloat(totalAmount.textContent) - (parseFloat(tdQuantity.textContent) * parseFloat(tdPrice.textContent));
//         if(typeof quantity !== 'undefined')
//          totalProduct = parseFloat(tdQuantity.textContent) + parseFloat(quantity);
//          else
//          totalProduct = parseFloat(tdQuantity.textContent) + 1;

    
//         totalAmount.innerHTML = totalCurrent + (totalProduct * parseFloat(tdPrice.textContent));
//         tdQuantity.innerHTML = totalProduct;
//         tdTotal.innerHTML = totalProduct * parseFloat(tdPrice.textContent);

//         found=true;
//     } catch (error) {
//         found = false;
//     }
    
//     return found;
// }

function addToCart(code, quantity){
    x= new XMLHttpRequest();
    x.open('GET',cartURL+'?action=add'+'&code='+code+'&quantity='+quantity)
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            console.log(JSON.parse(x.responseText))
        }
        
    }
}



function showCart(){
    x= new XMLHttpRequest();
    x.open('GET',cartURL+'?action=show')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            // updateTable(JSON.parse(x.responseText));
            console.log((x.responseText))
        }
        
    }
}
function updateTable(jsonItems){
    jsonItems.forEach(item => {
        code = item.code;
        //Elements
        tableBody = document.getElementById(idTableBody)
        tr = document.createElement('tr')
        tr.className= "tr-products"
        tdCode = document.createElement('td')
        tdName = document.createElement('td')
        tdPrice = document.createElement('td')
        tdQuantity = document.createElement('td')
        tdTotal = document.createElement('td')
        totalAmount = document.getElementById(idTotalCurrentLabel);
        //Set ids
        tr.id='row'+code;
        tdCode.id='code'+code;
        tdName.id='name'+code;
        tdPrice.id='price'+code;
        tdQuantity.id ='quantity'+code;
        tdTotal.id ='total'+code;
        //innerHTML
        tdCode.innerHTML = code;
        tdName.innerHTML = item.name;
        tdPrice.innerHTML= item.price;
        console.log(item)
        tdQuantity.innerHTML = item.quantity

        //Append everthing
        tr.appendChild(tdCode);
        tr.appendChild(tdName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdQuantity);
        tr.appendChild(tdTotal);
        tableBody.appendChild(tr);

    });
    
}
function removeFromCar(code){
    x= new XMLHttpRequest();
    x.open('GET',cartURL+'?action=add'+'&code='+code)
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            console.log(JSON.parse(x.responseText))
        }
        
    }
}
