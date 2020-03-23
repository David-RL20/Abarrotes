const idInputCode  = 'inputCodeProduct'
const dataList =  'dataListProducts' 
const idTableBody = "tableBody";
const idTotalCurrentLabel = "totalCurrently";
const ID_TOTAL_LABEL_WINDOW = "label-total-window";
const AllProductsURL = "http://localhost/Abarrotes/api/AllProducts.php"
 
class Product{
    constructor(){
        this.getProducts()
        this.addInputListener()
        this.car = new Array() 
        this.addChargeSellListener();
        this.resetProduct();
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
                    this.openPopUpSell();
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
                        this.verifyQuantityBulk();

                    }else if (product.bulk == 'no' && typeof this.quantity == 'undefined'){
                        this.quantity=1;
                        this.subtotal = this.quantity * this.price 
                        this.addToCar();
                        this.updateTotal();
                        this.addToTable(); 
                        this.resetProduct();
                    }
                    //#endregion

                   
                    infoInput.value=''
                    infoInput.focus()  
                    
                }else{
                    //#region confirmation for quantity
                    if(product.bulk == 'si' && typeof this.quantity == 'undefined'){
                        //metodo que muestra un popup y regresa el valor del input
                        //vere si lo puedo hacer con una promesa
                        this.showQuantityPopUp();    
                        this.verifyQuantityBulk();  
                        this.setPopUpListener()


                    }else if (product.bulk == 'no' && typeof this.quantity == 'undefined'){
                        this.quantity=1;
                        this.subtotal = this.quantity * this.price

                        this.updateCart();
                        this.updateTable();
                        this.updateTotal(); 
                        this.resetProduct();
                        infoInput.value=''
                        infoInput.focus() 
                    }
                    //#endregion
                   
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
            subtotal:this.subtotal
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
        tr.id=this.code
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
            let code = tr.id
            this.removeFromCar(code);
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
        this.updateTotal(); 

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
    updateTable(){
        let tdSubTotal = document.getElementById('subtotal'+this.code)
        let tdQuantity = document.getElementById('quantity'+this.code)
        tdQuantity.innerHTML = this.quantity;
        tdSubTotal.innerHTML = this.subtotal;
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
        let labelWindow = document.getElementById(ID_TOTAL_LABEL_WINDOW); 
        labelTotal.innerHTML= this.total;
        labelWindow.innerHTML = '$'+this.total;
    }
    
    setPopUpListener(){
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        let button = document.getElementById('cerrar-popup');
        let input = document.getElementById('popup-input-quantity');
        let infoInput = document.getElementById(idInputCode);

        //asignar para poder cerrar la ventana
        button.addEventListener('click',this.hiddeQuantityPopUp)
        
        input.addEventListener('keydown',()=>{
            if(event.keyCode == 13){
                if(typeof input.value !== 'undefined' && input.value != ''){
                    this.quantity= input.value
                    this.subtotal = this.quantity * this.price
                    let isInCar = this.verifyIsInCar()
                    if(this.verifyIsInCar() == true){
                        console.log(this.code)
                        this.updateCart();
                        this.updateTable();
                        this.updateTotal();  
                        this.resetProduct();
                    }else{

                        this.addToCar(); 
                        this.addToTable(); 
                        this.resetProduct();
                    } 
                    this.hiddeQuantityPopUp()
                    infoInput.value='' 
                    input.value=''
                }else{
                    //cancelar transaccion porque el valor esta vacio
                    swal({
                        title: 'Cantidad Vacia',
                        text: "La cantidad que se ingreso es 0 ",
                        icon: 'error', 
                        color: '#123', 
                        button: 'ok',
                        cancel:'cancelar'
                      })
                      .then(()=>{
                         setTimeout(()=>input.focus(),150)
                      }) 
                    
                    
                }
            }else if(event.keyCode == 27){
                this.hiddeQuantityPopUp();
                
            }
        });
        
        
    }
    showQuantityPopUp(){
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        let input = document.getElementById('popup-input-quantity')
        overlay.classList.add('active');
        div.classList.add('active');

        setTimeout(() => {input.focus()}, 100);

    }
    hiddeQuantityPopUp(){
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        overlay.classList.remove('active');
        div.classList.remove('active');
        this.focusInputProduct();
    }
    addCancelationListener(){
        let btnCancel = document.getElementById("btn-cancel-sell");
        btnCancel.addEventListener("click",()=>{
            swal({
                title: 'Cancelar compra',
                text: "La compra se cancelara completamente,esta seguro que quiere cancelar ?",
                icon: 'warning', 
                color: '#123', 
                buttons: [
                    'No, cancelar',
                    '  Si  '
                  ],
                cancel:'cancelar'
              })
              .then((result) => {
                if (result.value) {
                  swal(
                    'Eliminada!',
                    'Compra eliminada de maanera exitosa',
                    'success'
                  )
                }
                this.cancelTransaction()
              }) 
            .catch(()=>{
                console.log("se cancela la cancelacion")
            })
        })
    }
    cancelTransaction(){
        if(this.car != '' && typeof this.car !== 'undefined'){
            this.car.forEach(ele => {
                let tr = document.getElementById(ele.code)
                let body = document.getElementById(idTableBody)
                body.removeChild(tr);
            });
            let input = document.getElementById(idInputCode);
            input.value='';
            this.resetProduct();
            this.total=0
            this.name=''
            this.price=0.0
            this.subtotal=0
            this.car = new Array()
            this.updateTotal()
        }
    }

    addChargeSellListener(){
        let btnAbrirPopup = document.getElementById('abrir-popup'),
         btnCerrarPopup = document.getElementById('btn-cerrar-popup'),
         
        input = document.getElementById('inputAmount'); 

        //Add events listeners
        btnAbrirPopup.addEventListener('click', this.openPopUpSell);
        btnCerrarPopup.addEventListener('click', this.closePopUpSell);
        input.addEventListener('keydown',this.checkChange.bind(this))
    }

     openPopUpSell(){
        let overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup'),
        input = document.getElementById('inputAmount');
        // focus input
        setTimeout(() => {input.focus()}, 100); 
        
        overlay.classList.add('active');
        popup.classList.add('active');
        
    }
    closePopUpSell(){ 
        let overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup')
        overlay.classList.remove('active');
        popup.classList.remove('active');
        this.focusInputProduct()
    }
    checkChange(){
        let input = document.getElementById('inputAmount'); 
        if(event.keyCode == '13'){
            if(input.value >= this.total){
                //vamos bien
                let changeLabel = document.getElementById('change-label')
                changeLabel.innerHTML = (input.value - this.total)
            }else{
                let missing = this.total - input.value;
                swal({
                    icon: 'warning',
                    title: 'Aun faltan unos billetitos en esta cuenta',
                    text: 'faltan :  $'+ missing
                })
                .then(()=>{
                    input.focus();
                })
            }
        }
        if(event.keyCode == 27){
            this.closePopUpSell();
        }
        console.log(event.keyCode)
        
        
    }

    resetProduct(){
        this.subtotal=undefined;
        this.code=undefined;
        this.quantity=undefined;
    }
    focusInputProduct(){
        setTimeout(() => {
            let input = document.getElementById(idInputCode)
            input.focus() 
        }, 100);
    }
    verifyQuantityBulk(){
        if(typeof this.quantity == 'undefined'){
            this.verifyQuantityBulk()
        }else{

            console.clear()
        }
    }
    updateCart(){
        let indexFound = this.indexFound()
        let totalQuantity = parseFloat(this.car[indexFound].quantity) + parseFloat(this.quantity)
        let subtotal =  parseFloat(this.car[indexFound].subtotal) + parseFloat(this.subtotal)
        this.car[indexFound].subtotal = subtotal
        this.car[indexFound].quantity = totalQuantity 
        this.quantity = totalQuantity;
        this.subtotal = subtotal;
    }
    indexFound(){ 
        let position = 0
        for(let i=0;i<this.car.length;i++){
            if(this.code == this.car[i].code){
               position=i
            }
        } 
        return position;
    }


}
 
function init(){
    product = new Product();  
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

