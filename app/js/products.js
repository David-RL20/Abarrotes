function init(){
    console.log('Initializing document');
    getProducts();
    setTimeout(getDepartments,2000)  
    
 

}

//Get all the products from the data base
function getProducts(){
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllProducts.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            let products = JSON.parse(x.responseText); 
            console.log(products)
            products.forEach(product => { 
                tr =document.createElement('tr')
                tdCode =document.createElement('td')
                tdName =document.createElement('td')
                tdPrice =document.createElement('td') 
                tdDepartament =document.createElement('td')
        
                tdButton = document.createElement('td')
                editButton = document.createElement('button')
                editImage = document.createElement('img')
                deleteButton = document.createElement('button')
                deleteImage = document.createElement('img')
                //src image
                editImage.src = 'images/edit.png'
                //ids
                editImage.id= 'image'+product.code
                editButton.id='button'+ product.code;
                tdCode.id= 'code'+product.code
                tdName.id= 'name'+product.code
                tdPrice.id= 'price'+product.code 
                tdDepartament.id= 'department'+product.code
                
                editButton.classList.add('btn-outline-info')
                editButton.style.padding='.3rem .45rem;'
                editButton.classList.add('btn')
                editImage.className="image"
                editing = false;
                //onclick
                editButton.onclick = function(){
                    buttonEdit = document.getElementById('button'+ product.code)
                    imageButton = document.getElementById('image'+product.code)
                    tdCode =document.getElementById('code'+product.code)
                    tdName =document.getElementById('name'+product.code)
                    tdPrice =document.getElementById('price'+product.code) 
                    tdDepartament =document.getElementById('department'+product.code)
        
                    
                    
                    //We click and begin editing
                    if(!editing){   
                        //Cuando da click y comienza a edita pasa lo siguiente
        
                        console.log('Editing...')
                        imageButton.src='images/save.png'
        
                        var inputCode = document.createElement('input')
                        var inputName = document.createElement('input')
                        var inputPrice = document.createElement('input') 
                        var selectDepartment = document.createElement('select')
        
                        //ids
                        inputCode.id= 'inputCode'+product.code;
                        inputName.id= 'inputName'+product.code;
                        inputPrice.id= 'inputPrice'+product.code; 
                        selectDepartment.id= 'selectDepartment'+product.code;
        
                        
                        //set input
                        inputCode.value = tdCode.textContent;
                        inputName.value= tdName.textContent;
                        inputPrice.value= tdPrice.textContent; 
                        selectDepartment.value= tdDepartament.textContent;
        
                        //input type
        
                        inputCode.type='number';
                        inputName.type='text';
                        inputPrice.type='number'; 
                        
                        //Poner el texto de los td en blanco
                        tdCode.innerHTML=''                
                        tdName.innerHTML=''                
                        tdPrice.innerHTML='' 
                        tdDepartament.innerHTML=''  
                        
                        //add options to the select 
        
                        tdCode.appendChild(inputCode)
                        tdName.appendChild(inputName)
                        tdPrice.appendChild(inputPrice) 
                        tdDepartament.appendChild(selectDepartment)
        
                    }
                    else{
                        //we click and begin saving
                        if(editing){
                            console.log('Saving...')
                            imageButton.src =  'images/edit.png'
        
                            //Get inputs
                            inputCode= document.getElementById('inputCode'+product.code)
                            inputName= document.getElementById('inputName'+product.code)
                            inputPrice= document.getElementById('inputPrice'+product.code) 
                            selectDepartment= document.getElementById('selectDepartment'+product.code)
                            //Get td
                            tdCode= document.getElementById('code'+product.code)
                            tdName= document.getElementById('name'+product.code)
                            tdPrice= document.getElementById('price'+product.code) 
                            tdDepartament= document.getElementById('department'+product.code);
        
                            //put values of inputs into tds
                            tdCode.innerHTML=inputCode.value;                    
                            tdName.innerHTML=inputName.value;                    
                            tdPrice.innerHTML=inputPrice.value;                                            
                            
                        }
                    }
                    editing = !editing;
                }
                //inner data
                tdCode.innerHTML = product.code;
                tdName.innerHTML = product.name;
                tdPrice.innerHTML = product.price;  
                if(product.department != '' && typeof product.department !== 'undefined'){
                    product.department.forEach(department => {
                        tdDepartament.innerHTML = department.name;
                    });
                }
                
                editButton.appendChild(editImage);
                deleteButton.appendChild(deleteImage);
                tdButton.appendChild(editButton)
                tdButton.appendChild(deleteButton)
                tr.appendChild(tdCode);
                tr.appendChild(tdName);
                tr.appendChild(tdPrice); 
                tr.appendChild(tdDepartament);
                tr.appendChild(tdButton);
                tableBody.appendChild(tr);
            });
        }
        
    }

}

function getDepartments(){
    let a = new Array();
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllDepartments.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){ 
              a = JSON.parse(x.responseText);  
        }   
    }
    return a;
}
