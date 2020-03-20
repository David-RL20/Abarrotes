//Constants like inputs, URLs, etc...
const idInputCode = "inputCodeProduct";
const idDataList = "dataListProducts";
const idTableBody = "tableBody";
const idTotalCurrentLabel = "totalCurrently";
const AllProductsURL = "http://localhost/Abarrotes/api/AllProducts.php"
const cartURL = "http://localhost/Abarrotes/api/AllProducts.php"
var AllProducts = JSON.parse(sessionStorage.products)
class product{
    constructor(code,quantity){
        this.code = code;
        this.quantity= quantity

    }

    setCode(code){this.code=code};
    getCode(){return this.code};

    setQuantity(quantity){this.quantity=quantity};
    getQuantity(){return this.quantity};

    sendToBackEnd(){
        x= new XMLHttpRequest();
        x.open('GET',cartURL+"?code="+this.code+"&quantity="+this.quantity)
        x.send()
        x.onreadystatechange = function(){
          if(x.status == 200 && x.readyState == 4){
               x.responseText;
            }
        
        }
    }

}


//Executes every time the page is refresh
function init(){
    getProducts();
    // sessionStorage.articleSelected = undefined;
    infoInput = document.getElementById(idInputCode);
    infoInput.focus();
    infoInput.addEventListener("keypress",function(){
        if(event.keyCode == '13'){
            if(infoInput.value != ''){
                var array = moreProducts(infoInput.value);
                if(typeof array !== 'undefined')
                    addToTable(array[1],array[0]);
                else 
                    addToTable(infoInput.value)

                infoInput.focus();
                infoInput.value='';
            }
            else{
                abrirPopUp();
            }
        }
    });
    
}


//Get all the products from the data base
function getProducts(){
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET',AllProductsURL)
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            sessionStorage.products = x.responseText;
            addProductsToDataList(JSON.parse(sessionStorage.products))
        }
        
    }

}
//ADD the products to the data list
function addProductsToDataList(products){

    var dataList = document.getElementById(idDataList);
    products.forEach(product => {
        var option = document.createElement('option');
        option.value = product.code;
        // option.className="list-group-item";
        option.innerHTML = product.name;
        dataList.appendChild(option);
    });

}


//Deletes an article from the table and remove its from the array
function deleteArticle(){
    if( sessionStorage.articleSelected != 'undefined'){
        tr =document.getElementById('row'+sessionStorage.articleSelected)
        tableBody = document.getElementById(idTableBody)
        totalProduct =document.getElementById('total'+sessionStorage.articleSelected)
        totalAmount = document.getElementById(idTotalCurrentLabel)
        

        totalAmount.innerHTML = parseFloat(totalAmount.textContent) - parseFloat(totalProduct.textContent);
        removeFromCar(sessionStorage.articleSelected);
        tableBody.removeChild(tr);
    }
    else
    alert('Selecciona un producto para continuar');

    
}

//Search in database for the code of the product 
//and add all its data 
function addToTable(code , quantity){
    infoInput = document.getElementById(idInputCode);
    products = JSON.parse(sessionStorage.products)
    var found = false;
    
    products.forEach(product => {
        if(product.code == code){
            found=true;
            var existing = verifyIsInTable(code, quantity);
            if(!existing){
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
                tdCode.innerHTML = product.code;
                tdName.innerHTML = product.name;
                tdPrice.innerHTML= product.price;
                if(typeof quantity !== 'undefined'){
                    tdQuantity.innerHTML=quantity;
                }else
                {
                    tdQuantity.innerHTML=1;
                }
                tdTotal.innerHTML = (product.price * parseFloat(tdQuantity.textContent));

                if(totalAmount.textContent != '')
                 totalAmount.innerHTML = parseFloat(totalAmount.textContent) + parseFloat(tdTotal.textContent);
                 else
                 totalAmount.innerHTML = parseFloat(tdTotal.textContent);

                 //onclick event

                 tr.onclick = function(){
                     if( sessionStorage.articleSelected != 'undefined'){
                         try {
                             tableBefore = document.getElementById('row'+sessionStorage.articleSelected)
                             tableBefore.style.background = '#FFF';
                             
                         } catch (error) {
                             console.log('Articulo fue eliminado');
                         }
                         sessionStorage.articleSelected = product.code;
                         tableRow = document.getElementById('row'+product.code)
                         tableRow.style.background = '#ccc'
                     }else{
                        sessionStorage.articleSelected = product.code;
                        tableRow = document.getElementById('row'+product.code)
                        tableRow.style.background = '#ccc'
                     }
                         
                     
                 }

                //Append everthing
                tr.appendChild(tdCode);
                tr.appendChild(tdName);
                tr.appendChild(tdPrice);
                tr.appendChild(tdQuantity);
                tr.appendChild(tdTotal);
                tableBody.appendChild(tr);
            }
        }
    });

    if(!found){
        alert('Producto invalido');
        infoInput.value='';
        infoInput.focus();
        
    }
}

function moreProducts(text){
    var stringInput = document.getElementById(idInputCode)
    string = text;
    position = string.indexOf("*");
    if(position != -1){
        totalProducts = string[position];
        quantity = string.slice(0,position);
        if(quantity.match(/[a-z]/i)){
            alert('Cantidad equivocada');
            stringInput.value=''
            stringInput.focus();
        }
        productCode = string.slice(position + 1,string.length)
        if(productCode.match(/[a-z]/i)){
            alert('El codigo del producto no deber contener letras');
            stringInput.value=''
            stringInput.focus();
        }
        error = false;
        //validates if it has more than one *
        for(var i = 1; i< productCode.length;i++){
            if(productCode[i] == '*'){
                error=true;
            }
        }
        if(error){
            alert('Error De Cantidad, Demasiados ** ')
            stringInput.value=''
            stringInput.focus();
        }
        return Array(quantity,productCode) 
    }
    else
        return undefined
}

function verifyIsInTable(code , quantity){
    found = false;
    try {
        tdCode =document.getElementById('code'+code)
        tdQuantity = document.getElementById('quantity'+code);
        tdPrice = document.getElementById('price'+code);
        tdTotal = document.getElementById('total'+code);
        totalAmount =document.getElementById(idTotalCurrentLabel);
        if(totalAmount.textContent !='')
        totalCurrent = parseFloat(totalAmount.textContent) - (parseFloat(tdQuantity.textContent) * parseFloat(tdPrice.textContent));
        if(typeof quantity !== 'undefined')
         totalProduct = parseFloat(tdQuantity.textContent) + parseFloat(quantity);
         else
         totalProduct = parseFloat(tdQuantity.textContent) + 1;

    
        totalAmount.innerHTML = totalCurrent + (totalProduct * parseFloat(tdPrice.textContent));
        tdQuantity.innerHTML = totalProduct;
        tdTotal.innerHTML = totalProduct * parseFloat(tdPrice.textContent);

        found=true;
    } catch (error) {
        found = false;
    }
    
    return found;
}

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

function removeFromCar(code){
    x= new XMLHttpRequest();
    x.open('GET',cartURL+'?action=remove'+'&code='+code)
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            console.log(JSON.parse(x.responseText))
        }
        
    }
}
