const urlProducts = 'http://localhost/Abarrotes/api/AllProducts.php'
const urlShoppingCart='';
// const tableBodyID='tableBody';
const inputProduct='inputCodeProduct';
const totalLabel='';

//Executes every time the page is refresh
function init(){
    getProducts();
    infoInput = document.getElementById(inputProduct);
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
                chargeSell();
            }
        }
    });
    
}

//Get all the products from the data base
function getProducts(){
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET',urlProducts)
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
//Search in database for the code of the product 
//and add all its data 
function addToTable(code , quantity){
    infoInput = document.getElementById(inputProduct);
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
                tdSubTotal = document.createElement('td')
                totalAmount = document.getElementById('totalCurrently');
                //Set ids
                tr.id='row'+code;
                tdCode.id='code'+code;
                tdName.id='name'+code;
                tdPrice.id='price'+code;
                tdQuantity.id ='quantity'+code;
                tdSubTotal.id ='subtotal'+code;
                //innerHTML
                tdCode.innerHTML = product.code;
                tdName.innerHTML = product.name;
                tdPrice.innerHTML= product.price;

                // //set quantity 
                // if(typeof quantity !== undefined){
                //       tdQuantity.innerHTML = quantity;  
                // }else{
                //     tdQuantity.innerHTML=1;
                // }
                    
                // //set subtotal
                // tdSubTotal="0";
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

                //send to server session 


                //Append everthing
                tr.appendChild(tdCode);
                tr.appendChild(tdName);
                tr.appendChild(tdPrice);
                tr.appendChild(tdQuantity);
                tr.appendChild(tdSubTotal);
                tableBody.appendChild(tr);
            }
        }
    });

    if(!found){
        alert('Producto invalido');
        resetInput();
        
    }
    console.log(found + ' ' + code);
}
//verify if there is a  * in the input products so it can increase the quantity
function moreProducts(text){
    string = text;
    position = string.indexOf("*");
    if(position != -1){
        totalProducts = string[position];
        quantity = string.slice(0,position);
        if(quantity.match(/[a-z]/i)){
            alert('Cantidad equivocada');
            resetInput();
        }
        productCode = string.slice(position + 1,string.length)
        if(productCode.match(/[a-z]/i)){
            alert('El codigo del producto no deber contener letras');
            resetInput();
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
            resetInput();
        }
        return Array(quantity,productCode) 
    }
    else
        return undefined
}

//verify if the 
//returns true if found and false if not
function verifyIsInTable(code , quantity){
    found = false;
    try {
        tdCode =document.getElementById('code'+code)
        tdQuantity = document.getElementById('quantity'+code);
        tdPrice = document.getElementById('price'+code);
        tdTotal = document.getElementById('total'+code);
        totalAmount =document.getElementById('totalCurrently');
         //get subtotal's product

        //update total's

        //if quantity is defined update
        if(typeof quantity !== 'undefined'){

        } else{

        }
        found=true;
    } catch (error) {
        found = false;
    }
    
    return found;
}

//Asign an empty value to product's input
//and focuses it
function resetInput(){
    var stringInput = document.getElementById(inputProduct)
    stringInput.value=''
    stringInput.focus();

}

//Hide the window sell from content
function exitBuyWindow (){
    windowSell = document.getElementById('sellWindow');
    windowSell.style.display = 'none'
}
//execute the sell, open a division for the total and type of pay 
//also save everything in the database 
function chargeSell(){
    //get elements 
    windowSell = document.getElementById('sellWindow');
    totalLabel = document.getElementById('totalLabelWindow');
    total = document.getElementById('totalCurrently').textContent;
    changeLabel = document.getElementById('changeClientLabel');
    inputAmount = document.getElementById('inputAmountPaid')
    //inner data
    totalLabel.innerHTML = '  '+' &#36'+' '+ parseFloat(total);

    windowSell.style.display = 'block';
    inputAmount.focus();
}

// Deletes an article from the table and remove its from the array
function deleteArticle(){
    if( sessionStorage.articleSelected != 'undefined'){
        tr =document.getElementById('row'+sessionStorage.articleSelected)
        tableBodyID = document.getElementById('tableBody')
        totalProduct =document.getElementById('total'+sessionStorage.articleSelected)
        totalAmount = document.getElementById('totalCurrently')
        

        totalAmount.innerHTML = parseFloat(totalAmount.textContent) - parseFloat(totalProduct.textContent);

        tableBodyID.removeChild(tr);
    }
    else
    alert('Selecciona un producto para continuar');

    
}

// When you click on a Table Row(tr)
// This method assign the value or id of this TR
// Then you can delete it 
function selectArticle(id){
    var tr = document.getElementById(id);
    var tHead = document.getElementById('tableBody');
    tHead.removeChild(tr);
}







function inputPaid(){
    var input = document.getElementById('inputAmountPaid');

    //event listener
    input.addEventListener('keyup', function(){
        if(event.keyCode == '13'){
            console.log('u paining');
        }
        if(event.keyCode == '27'){
            windowSell = document.getElementById('sellWindow');
            inputProduct = document.getElementById(inputProduct);
            windowSell.style.display = 'none';
            inputProduct.focus();
        }
    });
}
