const idInputCode = "inputCodeProduct";
const idDataList = "dataListProducts";
const idTableBody = "tableBody";
const idTotalCurrentLabel = "totalCurrently";
const AllProductsURL = "http://localhost/Abarrotes/api/AllProducts.php"


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

                // infoInput.focus();
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
                if(product.bulk == 'si'){
                    if(typeof quantity !== 'undefined'){
                        tdQuantity.innerHTML=quantity;
                    }else
                    {   
                        showQuantity();
                        tdQuantity.innerHTML= document.getElementById('popup-input-quantity').value
                        
                    }
                }else{
                    if(typeof quantity !== 'undefined'){
                        tdQuantity.innerHTML=quantity;
                    }else
                    {
                        tdQuantity.innerHTML=1;
                    }
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
//if is a * separates the code and the quantity of each 
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
//checks for an existing product in the table
// returns true if exists 
// and false if not
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
        
         
         x= new XMLHttpRequest();
         x.open('GET',AllProductsURL+'?code='+code)
         x.send()
         x.onreadystatechange = function(){
             if(x.status == 200 && x.readyState == 4){
                result= JSON.parse(x.responseText);
                if(result.bulk == 'si'){
                    if(typeof quantity !== 'undefined'){
                        totalProduct = parseFloat(tdQuantity.textContent) + parseFloat(quantity);
                    }
                    else{
                        totalProduct = parseFloat(tdQuantity.textContent) + showQuantity();
                    }
                    
                }else{
                    if(typeof quantity !== 'undefined')
                    totalProduct = parseFloat(tdQuantity.textContent) + parseFloat(quantity);
                    else
                    totalProduct = parseFloat(tdQuantity.textContent) + 1;
                }
             }else{
                 result= false;
             }
             
         }
    
        totalAmount.innerHTML = totalCurrent + (totalProduct * parseFloat(tdPrice.textContent));
        tdQuantity.innerHTML = totalProduct;
        tdTotal.innerHTML = totalProduct * parseFloat(tdPrice.textContent);

        found=true;
    } catch (error) {
        found = false;
    }
    
    return found;
}
//for each tr in table body realice the sell
//send the sell to backend
function chargeSell(){
    body = document.querySelector('#'+idTableBody);
    trs = body.getElementsByTagName('tr');

    for(i=0;i<trs.length;i++){
        tds = trs[i].getElementsByTagName('td');
        code = tds[0].textContent
        quantity =tds[3].textContent
        
    }
}
//show an window with and input
//  returns input's values
function showQuantity(){
    overlay = document.getElementById('overlay-quantity');
    div = document.getElementById('div-quantity');
    button = document.getElementById('cerrar-popup');
    input = document.getElementById('popup-input-quantity');

    overlay.classList.add('active');
    div.classList.add('active');

    
    
    //asignar para poder cerrar la ventana
    button.addEventListener('click',function(){
        overlay.classList.remove('active');
	    div.classList.remove('active');
    })
    
    input.addEventListener('keypress',function(){
        if(event.keyCode == 13){
            if(typeof input.value !== 'undefined'){
                
                overlay.classList.remove('active');
                div.classList.remove('active');
            }else{
                //cancelar transaccion porque el valor esta vacio
                alert('Cantidad vacia');
                overlay.classList.remove('active');
                div.classList.remove('active');
                
            }
        }else if(event.keyCode == 27){
            overlay.classList.remove('active');
            div.classList.remove('active');

        }
    });

    //focus input
    input.focus();
}
