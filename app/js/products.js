function init(){
    console.log('Initializing document');
    getProducts();
    // x= new XMLHttpRequest();
    // x.open('GET','http://localhost/Abarrotes/api/AllDepartments.php')
    // x.send()
    // x.onreadystatechange = function(){
    //     if(x.status == 200 && x.readyState == 4){
    //        // sessionStorage.departments = x.responseText;
    //         console.log(JSON.parse(x.responseText))
    //     }   
    // }
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
                //Cuando da click y comienza a edita pasa lo siguiente

                console.log('Editing...')
                imageButton.src='../../images/save.png'

                var inputCode = document.createElement('input')
                var inputName = document.createElement('input')
                var inputPrice = document.createElement('input')
                var inputQuantity = document.createElement('input')
                var selectDepartment = document.createElement('select')

                //ids
                inputCode.id= 'inputCode'+product.code;
                inputName.id= 'inputName'+product.code;
                inputPrice.id= 'inputPrice'+product.code;
                inputQuantity.id= 'inputQuantity'+product.code;
                selectDepartment.id= 'selectDepartment'+product.code;

                
                //set input
                inputCode.value = tdCode.textContent;
                inputName.value= tdName.textContent;
                inputPrice.value= tdPrice.textContent;
                inputQuantity.value= tdQuantity.textContent;
                selectDepartment.value= tdDepartament.textContent;

                //input type

                inputCode.type='number';
                inputName.type='text';
                inputPrice.type='number';
                inputQuantity.type='number';
                
                //Poner el texto de los td en blanco
                tdCode.innerHTML=''                
                tdName.innerHTML=''                
                tdPrice.innerHTML=''                
                tdQuantity.innerHTML=''  
                tdDepartament.innerHTML=''  
                
                departments=[
                    {
                        name:'Prueba1',
                        code:'cd'
                    },
                    {
                        name:'Prueba2',
                        code:'cd'
                    },
                    {
                        name:'Prueba3',
                        code:'cd'
                    }
                ]
                departments.forEach(department => {
                    var option =document.createElement('option')

                    option.value= department.code
                    option.innerHTML= department.name

                    selectDepartment.appendChild(option)
                });


                tdCode.appendChild(inputCode)
                tdName.appendChild(inputName)
                tdPrice.appendChild(inputPrice)
                tdQuantity.appendChild(inputQuantity)
                tdDepartament.appendChild(selectDepartment)

            }
            else{
                //we click and begin saving
                if(editing){
                    console.log('Saving...')
                    imageButton.src = '../../images/edit.png'

                    //Get inputs
                    inputCode= document.getElementById('inputCode'+product.code)
                    inputName= document.getElementById('inputName'+product.code)
                    inputPrice= document.getElementById('inputPrice'+product.code)
                    inputQuantity= document.getElementById('inputQuantity'+product.code)
                    selectDepartment= document.getElementById('selectDepartment'+product.code)
                    //Get td
                    tdCode= document.getElementById('code'+product.code)
                    tdName= document.getElementById('name'+product.code)
                    tdPrice= document.getElementById('price'+product.code)
                    tdQuantity= document.getElementById('quantity'+product.code)
                    tdDepartament= document.getElementById('department'+product.code);

                    //put values of inputs into tds
                    tdCode.innerHTML=inputCode.value;                    
                    tdName.innerHTML=inputName.value;                    
                    tdPrice.innerHTML=inputPrice.value;                    
                    tdQuantity.innerHTML=inputQuantity.value;                    
                    tdDepartament.innerHTML=selectDepartment.options[selectDepartment.selectedIndex].text                  
                    
                }
            }
            editing = !editing;
        }
        //inner data
        tdCode.innerHTML = product.code;
        tdName.innerHTML = product.name;
        tdPrice.innerHTML = product.price;
        tdQuantity.innerHTML = product.stock;
        product.department.forEach(department => {
            tdDepartament.innerHTML = department.name;
        });
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

function getDepartment(){
    a = new Array();
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllDepartments.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            sessionStorage.departments = x.responseText;
            a = JSON.parse(x.responseText);
        }   
    }
    return a;
 }

function init(){
    console.log('intializing document...');
    document.getElementById('inputNameProduct').focus();
    //add deparments to the list
    addDepartments();

}
//when you click on the button save data in database
function save(){
    var url = 'http://localhost/Abarrotes/api/AllProducts.php ';
    var name = document.getElementById('inputNameProduct').value;
    var code = document.getElementById('inputCodeProduct').value;
    var price = document.getElementById('inputPriceproduct').value;
    var stock = document.getElementById('quantityProduct').value;
    var depto = document.getElementById('selectDepartmentProduct').value;

    var x = new XMLHttpRequest();
    x.open('POST',url);
    x.setRequestHeader('Content-type','application/x-www-form-urlencoded')
    x.send('code='+code+'&'+'stock='+stock+'&'+'name='+name+'&'+'price='+price+'&'+'dptoCode='+depto);
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            if(x.responseText != '1'){
                alert('Producto existente !');
                clear()
            }else{
                alert('Producto agregado de manera exitosa!');
                clear();
            }
        }
    }



}

//clear all values in html
function clear(){
     document.getElementById('inputNameProduct').value ='';
     document.getElementById('inputCodeProduct').value ='';
     document.getElementById('inputPriceproduct').value ='';
     document.getElementById('quantityProduct').value = '';
     document.getElementById('selectDepartmentProduct').value ='';
}

//add the departments to the options 
function addDepartments(){
    var x = new XMLHttpRequest();
    var url='http://localhost/Abarrotes/api/AllDepartments.php'

    var depto = document.getElementById('selectDepartmentProduct');
    x.open('GET',url);
    x.send();
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            // console.log(x.responseText)
            var deptos= JSON.parse(x.responseText);
            deptos.forEach(dept => {
                var option = document.createElement('option');
                option.value= dept.code
                option.textContent= dept.name
                
                depto.appendChild(option)
            });
        }
    }
}