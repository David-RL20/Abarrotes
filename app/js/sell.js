const idInputCode  = 'inputCodeProduct'
const dataList =  'dataListProducts' 
const idTableBody = "tableBody";
const idTotalCurrentLabel = "totalCurrently";
const AllProductsURL = "http://localhost/Abarrotes/api/AllProducts.php"

class Product{
    constructor(){
        this.getProducts()
        this.addInputListener()
        this.car = new Array() 
    }

    getProducts(){
        let x= new XMLHttpRequest();
        x.open('GET',AllProductsURL)
        x.send()
        x.onreadystatechange = ()=>{
            if(x.status == 200 && x.readyState == 4){
                this.products = JSON.parse(x.responseText)
                this.addProductsToDataList()
            } 
            
        }
    }
    addProductsToDataList(){
        let list = document.getElementById(dataList)
        this.products.forEach(product => {
            let option = document.createElement('option');
            option.value = product.code;
            option.innerHTML = product.name;
            list.appendChild(option);
        });
    }
    addInputListener(){
        let input = document.getElementById(idInputCode);
        input.focus();
        input.addEventListener("keypress",() => {
            if(event.keyCode == '13'){
                if(input.value != ''){
                    let array = this.moreProducts(input.value);
                    if(typeof array !== 'undefined'){
                        //get the values of code an quantity if * on input
                        this.code = array[1]
                        this.quantity=array[0]
                        this.verification();
                    }
                    else {
                        this.code = input.value 
                       this.verification()
                    }
                }
                else{
                    abrirPopUp();
                }
            }
        });
        this.addCancelationListener()
    }
    verification(){
        let infoInput = document.getElementById(idInputCode);
        let products = this.products
        var found = false;
        products.forEach(product => {
            if(product.code == this.code){
                found=true;
                var existing = this.verifyIsInCar();
                if(!existing){
                   
                    //add to cart
                    this.price = product.price
                    this.name = product.name
                    //#region confirmation for quantity
            
                    if(product.bulk == 'si' && typeof this.quantity == 'undefined'){
                        //metodo que muestra un popup y regresa el valor del input
                        //vere si lo puedo hacer con una promesa
                        this.setPopUpListener()
                        this.showQuantityPopUp();
                    }else if (product.bulk == 'no' && typeof this.quantity == 'undefined'){
                        this.quantity=1;
                    }
                    //#endregion
                    this.addToCar();
                    this.updateTotal();
                    this.addToTable();   
                    
                }else{
                    console.log("ya esta en el arrito wei")
                }
            }
        });
    
        if(!found){
            alert('Producto invalido');
            infoInput.value='';
            infoInput.focus();
            
        }
    }
    moreProducts(text){
        let stringInput = document.getElementById(idInputCode)
        let string = text;
        let position = string.indexOf("*");
        if(position != -1){
            let totalProducts = string[position];
            let quantity = string.slice(0,position);
            if(quantity.match(/[a-z]/i)){
                alert('Cantidad equivocada');
                stringInput.value=''
                stringInput.focus();
            }
            let productCode = string.slice(position + 1,string.length)
            if(productCode.match(/[a-z]/i)){
                alert('El codigo del producto no deber contener letras');
                stringInput.value=''
                stringInput.focus();
            }
            var error = false;
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
    verifyIsInCar(){
        let found = false
        if(typeof this.car !== 'undefined' && this.car !== null && this.car !== ''){
            this.car.forEach(ele => {
                if(ele['code'] == this.code){
                    found=true
                }
            });
        }
        return found;

    }
    addToCar(){
        this.car.push({
            code:this.code,
            quantity:this.quantity,
            subtotal:(this.subtotal = this.quantity * this.price)
            }
        )
        
    }
    removeFromCar(code){
        for(let i=0;i < this.car.length;i++){
            if(this.car[i].code == code){
                if(this.car.length == 1){
                    this.car = new Array()
                }else{
                    this.car.splice(i,1);
                }
                console.log(this.car.length)
            }
        }
    }
    addToTable(){
        //creating elements
        let tr = document.createElement('tr')
        let tdCode = document.createElement('td')
        let tdName = document.createElement('td')
        let tdPrice = document.createElement('td')
        let tdQuantity = document.createElement('td')
        let tdSubTotal = document.createElement('td')
        let tdDelete = document.createElement('td')
        let image = document.createElement('img')

        //get body
        let tableBody = document.getElementById(idTableBody);

        //set id's
        tr.id='tr'+this.code
        tdCode.id='code'+this.code
        tdName.id='name'+this.code
        tdPrice.id='price'+this.code
        tdQuantity.id='quantity'+this.code
        tdSubTotal.id='subtotal'+this.code

        // image
        image.src="images/delete.png"
        image.classList.add("image")
        //append image
        tdDelete.appendChild(image);

        //On click delete row
            //argumento this.code se esta sobre escribiendo entonces hay que encontrar una manera 
            //de que cada uno se pueda eliminar de el carrito
        image.addEventListener('click',()=>{
            tableBody.removeChild(tr);
            this.removeFromCar(this.code);
            this.updateTotal();
        })
        //on mouse over
        image.addEventListener("mouseover",()=>{
            image.src = "images/delete_red.png"
        })
        image.addEventListener("mouseout",()=>{
            image.src = "images/delete.png"
        })

        //inner data 
        tdCode.innerHTML= this.code
        tdName.innerHTML = this.name
        tdPrice.innerHTML= this.price
        tdQuantity.innerHTML=this.quantity
        tdSubTotal.innerHTML=this.subtotal

        //append tds to tr
        tr.appendChild(tdCode)
        tr.appendChild(tdName)
        tr.appendChild(tdPrice)
        tr.appendChild(tdQuantity)
        tr.appendChild(tdSubTotal)
        tr.appendChild(tdDelete)

        //append tr to body
        tableBody.appendChild(tr)

    }
     
    getTotal(){
        let total = 0;
        this.car.forEach(ele=>{
            total = (ele.subtotal + total)
        })
        this.total=total;
    }
    updateTotal(){
        this.getTotal();
        let labelTotal = document.getElementById(idTotalCurrentLabel);
        console.log(this.total)
        labelTotal.innerHTML= this.total;
    }
    
    setPopUpListener(){
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        let button = document.getElementById('cerrar-popup');
        let input = document.getElementById('popup-input-quantity');

        //asignar para poder cerrar la ventana
        button.addEventListener('click',this.hiddeQuantityPopUp)
        
        input.addEventListener('keypress',()=>{
            if(event.keyCode == 13){
                if(typeof input.value !== 'undefined'){
                    this.quantity= input.value
                    this.hiddeQuantityPopUp()
                }else{
                    //cancelar transaccion porque el valor esta vacio
                    alert('Cantidad vacia');
                    this.hiddeQuantityPopUp();
                    
                }
            }else if(event.keyCode == 27){
                this.hiddeQuantityPopUp();
                
            }
        });
        
        
    }
    showQuantityPopUp(){
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        overlay.classList.add('active');
        div.classList.add('active');
    }
    hiddeQuantityPopUp(){
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        overlay.classList.remove('active');
        div.classList.remove('active');
    }
    addCancelationListener(){
        let btnCancel = document.getElementById("btn-cancel-sell");
        btnCancel.addEventListener("click",()=>{
            swal({
                title: 'Cancelar compra?',
                text: "La compra se cancelara completamente,esta seguro que quiere cancelar ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si,cancelar!'
              }).then((result) => {
                if (result.value) {
                  swal(
                    'Eliminada!',
                    'Compra eliminada de maanera exitosa',
                    'success'
                  )
                }
                this.cancelTransaction()
              })
        })
    }
    cancelTransaction(){
        setTimeout(() => {
            console.log("Cancelar comprar")
        }, 2000);
    }

}
 
function init(){
    window.product = new Product();  
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

