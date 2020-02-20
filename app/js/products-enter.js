//Executes every time the page is refresh
function init(){
    console.log('Registro de productos...')
    getProducts();
    sessionStorage.articleSelected = undefined;
    sessionStorage.toRegisterProducts=undefined;
    infoInput = document.getElementById('inputCodeProduct');
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
        }
    });
    
}

//Get all the products from the data base
function getProducts(){
    // Ask for all the products
    sessionStorage.products = '';
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllProducts.php')
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

        var dataList = document.getElementById('dataListProducts');
        products.forEach(product => {
            var option = document.createElement('option');
            option.value = product.code;
            option.innerHTML = product.name;
            dataList.appendChild(option);
        });

}

//Deletes an article from the table and remove its from the array
function deleteArticle(){
    if( sessionStorage.articleSelected != 'undefined'){
        tr =document.getElementById('row'+sessionStorage.articleSelected)
        tableBody = document.getElementById('tableBody')
        tableBody.removeChild(tr);
    }
    else
    alert('Selecciona un producto para continuar');

    
}

//Search in database for the code of the product 
//and add all its data 
function addToTable(code , quantity){
    infoInput = document.getElementById('inputCodeProduct');
    products = JSON.parse(sessionStorage.products)
    var found = false;
    products.forEach(product => {
        if(product.code == code){
            found=true;
            var existing = verifyIsInTable(code, quantity);
            if(!existing){
                //Elements
                tableBody = document.getElementById('tableBody')
                tr = document.createElement('tr')
                tdCode = document.createElement('td')
                tdName = document.createElement('td')
                tdPrice = document.createElement('td')
                tdQuantity = document.createElement('td')
                //Set ids
                tr.id='row'+code;
                tdCode.id='code'+code;
                tdName.id='name'+code;
                tdPrice.id='price'+code;
                tdQuantity.id ='quantity'+code;
                //innerHTML
                tdCode.innerHTML = product.code;
                tdName.innerHTML = product.name;
                tdPrice.innerHTML= product.price;
                if(typeof quantity !== 'undefined'){
                    tdQuantity.innerHTML=quantity;
                    var product = 
                        {
                            'code':product.code,
                            'quantity':quantity
                        }
                    
                    if(sessionStorage.toRegisterProducts !== 'undefined'){

                        sessionStorage.toRegisterProducts += (JSON.stringify(product));
                    }else{
                        sessionStorage.toRegisterProducts = (JSON.stringify(product));

                    }
                    console.log(sessionStorage.toRegisterProducts);
                }else{   
                    tdQuantity.innerHTML=1;
                    var product = {
                            'code':product.code,
                            'quantity':1
                        }
                    if(sessionStorage.toRegisterProducts !== 'undefined'){

                        sessionStorage.toRegisterProducts += (JSON.stringify(product));
                    }else{
                        sessionStorage.toRegisterProducts = (JSON.stringify(product));

                    }
                }
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

//Verify if there is an * in the input 
function moreProducts(text){
    var stringInput = document.getElementById('inputCodeProduct')
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
        
        console.log(sessionStorage.toRegisterProducts);
        //table td
        tdCode =document.getElementById('code'+code)
        tdQuantity = document.getElementById('quantity'+code);
        tdPrice = document.getElementById('price'+code); 
        if(typeof quantity !== 'undefined'){
            totalProduct = parseFloat(tdQuantity.textContent) + parseFloat(quantity);
            console.log(code +' , ' + totalProduct);
        }
        else{
            
            totalProduct = parseFloat(tdQuantity.textContent) + 1;
            console.log(code +' , ' + totalProduct);
         }
        tdQuantity.innerHTML = totalProduct;

        found=true;
    } catch (error) {
        found = false;
    }
    
    return found;
}
function save(){
    console.log(sessionStorage.toRegisterProducts);
}