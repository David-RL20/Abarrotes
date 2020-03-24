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
            insertProductsToTable(products)
            
        }
        
    }

}

function getDepartments(){ 
    // Ask for all the products
    x= new XMLHttpRequest();
    x.open('GET','http://localhost/Abarrotes/api/AllDepartments.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){ 
              sessionStorage.departments = (x.responseText);  
        }   
    } 
}

function insertProductsToTable(products){
    products.forEach(product => { 
        if(product.code != '' && typeof product.code !== 'undefined'){
            tr =document.createElement('tr')
            tdCode =document.createElement('td')
            tdName =document.createElement('td')
            tdPrice =document.createElement('td') 
            tdDepartament =document.createElement('td')
    
            tdCode.id= 'code'+product.code
            tdName.id= 'name'+product.code
            tdPrice.id= 'price'+product.code 
            tdDepartament.id= 'department'+product.code
            //#region Buttons 
    
            tdButton = document.createElement('td')
            editButton = document.createElement('button')
            editImage = document.createElement('img')
            deleteButton = document.createElement('button')
            deleteImage = document.createElement('img')
            //src image
            editImage.src = 'images/edit_blue.png'
            //ids
            editImage.id= 'image'+product.code
            editButton.id='button'+ product.code;
            deleteImage.src='images/delete_red.png'
            deleteImage.className='image'
            deleteButton.classList.add('btn-outline-danger') 
            deleteButton.classList.add('ml-1')
            deleteImage.id='delete'+product.code
            editImage.id='edit'+product.code
            
            editButton.classList.add('btn-outline-primary')  
            editImage.className="image"
            editing = false;
            //onclick edit
            editButton.onclick = function(){
                buttonEdit = document.getElementById('button'+ product.code)
                imageButton = document.getElementById('edit'+product.code) 
                tdName =document.getElementById('name'+product.code)
                tdPrice =document.getElementById('price'+product.code) 
                tdDepartament =document.getElementById('department'+product.code)
    
                
                
                //We click and begin editing
                if(!editing){   
                    //Cuando da click y comienza a edita pasa lo siguiente 
                    imageButton.src='images/edit.png'
                    console.log(imageButton) 
                    var inputName = document.createElement('input')
                    var inputPrice = document.createElement('input') 
                    var selectDepartment = document.createElement('select')
    
                    //ids 
                    inputName.id= 'inputName'+product.code;
                    inputPrice.id= 'inputPrice'+product.code; 
                    selectDepartment.id= 'selectDepartment'+product.code;
    
                    tdDepartament.innerHTML=''
                    //set input 
                    inputName.value= tdName.textContent;
                    inputPrice.value= tdPrice.textContent; 
                    selectDepartment.textContent= tdDepartament.textContent;
    
                    //input type
                    inputName.type='text';
                    inputPrice.type='number'; 
                    if(typeof sessionStorage.departments !== 'undefined' && sessionStorage.departments != ''){
                        let departments = JSON.parse(sessionStorage.departments)
                        departments.forEach(department => {
                            let  option = document.createElement('option')
                            option.value = department.code
                            option.innerHTML = department.name

                            selectDepartment.appendChild(option)
                        });
                    }
                    //Poner el texto de los td en blanco      
                    tdName.innerHTML=''                
                    tdPrice.innerHTML='' 
                    tdDepartament.innerHTML=''  
                    
                    //add options to the select 
     
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
                        tdName= document.getElementById('name'+product.code)
                        tdPrice= document.getElementById('price'+product.code) 
                        tdDepartament= document.getElementById('department'+product.code);
    
                        //put values of inputs into tds              
                        tdName.innerHTML=inputName.value;                    
                        tdPrice.innerHTML=inputPrice.value;
                        index = selectDepartment.selectedIndex
                        tdDepartament.innerHTML = selectDepartment[index].textContent                                           
                        
                    }
                }
                editing = !editing;
            }
    
            //onclick delete
            deleteButton.onclick = function(){
                swal({
                    title: 'Producto',
                    text: "Desea eliminar este producto?",
                    icon: 'warning', 
                    color: '#123', 
                    buttons: [
                        'No, cancelar',
                        '  Si  '
                      ],
                    cancel:'cancelar'
                  })
                  .then((result) => {
                    if (result) {
                      swal(
                        'Eliminado!',
                        'Este producto fue eliminado',
                        'success'
                      )
                    }
                    //remover divs y enviar un request para eliminar este producto
                    console.log("codigo :"+product.code)
    
                  }) 
                .catch(()=>{
                    console.log("se cancela la cancelacion")
                })
            }
            //mouse over
            deleteButton.addEventListener('mouseover',function(){
                deleteImage = document.getElementById('delete'+product.code)
                deleteImage.src='images/delete_white.png'
            })
            editButton.addEventListener('mouseover',function(){
                editImage = document.getElementById('edit'+product.code)
                editImage.src='images/edit_white.png'
            })
            //mouse out
            deleteButton.addEventListener('mouseout',function(){
                deleteImage = document.getElementById('delete'+product.code)
                deleteImage.src='images/delete_red.png'
            })
            editButton.addEventListener('mouseout',function(){
                editImage = document.getElementById('edit'+product.code)
                editImage.src='images/edit_blue.png'
            })
    
    
            //#endregion
    
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
        }
    });
}