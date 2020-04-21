const API_PRODUCTS = 'http://192.168.100.195/Abarrotes/api/AllProducts.php';
const API_DEPARTMENTS = 'http://192.168.100.195/Abarrotes/api/AllDepartments.php';

function init(){
    console.log('Initializing document');
    getProducts();
    setTimeout(getDepartments,1000) 
    setSearchListener()  
    
 

}

//Get all the products from the data base
async function getProducts(){ 
    try {
        const answer = await fetch(API_PRODUCTS)
        const products = await answer.json();
        insertProductsToTable(products) 
        stopLoader()
    } catch (error) {
        swal({
            position: 'top-end',
            icon: 'error',
            title: 'Error'+ error.message,
            showConfirmButton: true, 
        });
    }

}

async function getDepartments(){ 
    // Ask for all the products
    try {
        let response = await fetch(API_DEPARTMENTS); 
        sessionStorage.departments = await response.text() 
        
    } catch (error) {
        swal({
            position: 'top-end',
            icon: 'error',
            title: 'Error'+ error.message,
            showConfirmButton: true, 
        });
    }
}

function insertProductsToTable(products){
    products.forEach(product => { 
        if(product.code != '' && typeof product.code !== 'undefined'){
            tr =document.createElement('tr')
            tdCode =document.createElement('td')
            tdName =document.createElement('td')
            tdPrice =document.createElement('td') 
            tdBulk =document.createElement('td') 
            tdDepartament =document.createElement('td')
    
            tdCode.id= 'code'+product.code
            tdName.id= 'name'+product.code
            tdPrice.id= 'price'+product.code 
            tdDepartament.id= 'department'+product.code
            tdBulk.id='bulk'+product.code
            tr.id = 'tr'+product.code
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
                tdBulk =document.getElementById('bulk'+product.code)
    
                
                
                //We click and begin editing
                if(!editing){   
                    //Cuando da click y comienza a edita pasa lo siguiente  
                    var inputName = document.createElement('input')
                    var inputPrice = document.createElement('input') 
                    var selectBulk = document.createElement('select')
                    var selectDepartment = document.createElement('select')
    
                    //ids 
                    inputName.id= 'inputName'+product.code;
                    inputPrice.id= 'inputPrice'+product.code; 
                    selectDepartment.id= 'selectDepartment'+product.code;
                    selectBulk.id= 'selectBulk'+product.code;
    
                    tdDepartament.innerHTML=''
                    tdBulk  .innerHTML=''
                    //set input 
                    inputName.value= tdName.textContent;
                    inputPrice.value= tdPrice.textContent;  
                    
    
                    //input type
                    inputName.type='text';
                    inputPrice.type='number'; 
                    //select 
                    if(typeof sessionStorage.departments !== 'undefined' && sessionStorage.departments != ''){
                        let departments = JSON.parse(sessionStorage.departments)
                        departments.forEach(department => {
                            let  option = document.createElement('option')
                            option.value = department.code
                            option.innerHTML = department.name
                            selectDepartment.appendChild(option)
                        });
                    }

                    //options
                    optionSi = document.createElement('option')
                    optionNo = document.createElement('option')
                    //values
                    optionSi.value='si'
                    optionNo.value='no'
                    optionSi.innerHTML = 'si'
                    optionNo.innerHTML = 'no'  
                    selectBulk.appendChild(optionSi)
                    selectBulk.appendChild(optionNo)  
                    if(product.bulk == 'si'){
                        selectBulk.selectedIndex = 0
                    }
                    if(product.bulk == 'no'){
                        selectBulk.selectedIndex = 1
                    } 
                    //Poner el texto de los td en blanco      
                    tdName.innerHTML=''                
                    tdPrice.innerHTML='' 
                    tdDepartament.innerHTML=''  
                    tdBulk.innerHTML=''  
                    
                    //add options to the select 
     
                    tdName.appendChild(inputName)
                    tdPrice.appendChild(inputPrice) 
                    tdBulk.appendChild(selectBulk) 
                    tdDepartament.appendChild(selectDepartment)
    
                }
                else{
                    //we click and begin saving
                    if(editing){
                        console.log('Saving...') 
                        //Get inputs 
                        inputName= document.getElementById('inputName'+product.code)
                        inputPrice= document.getElementById('inputPrice'+product.code) 
                        selectDepartment= document.getElementById('selectDepartment'+product.code)
                        selectBulk= document.getElementById('selectBulk'+product.code)
                        //Get td 
                        tdName= document.getElementById('name'+product.code)
                        tdPrice= document.getElementById('price'+product.code) 
                        tdDepartament= document.getElementById('department'+product.code);
                        tdBulk= document.getElementById('bulk'+product.code);
    
                        //put values of inputs into tds              
                        tdName.innerHTML=inputName.value;                    
                        tdPrice.innerHTML=inputPrice.value;

                        indexDepto = selectDepartment.selectedIndex
                        indexBulk = selectBulk.selectedIndex

                        tdDepartament.innerHTML = selectDepartment[indexDepto].textContent    
                        tdBulk.innerHTML = selectBulk[indexBulk].textContent     
                        // send to backend
                        var x = new XMLHttpRequest();
                        x.open('POST','http://192.168.100.195/Abarrotes/api/AllProducts.php',true);
                        x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
                        x.send('action=update'+'&code='+product.code+'&bulk='+tdBulk.textContent+'&name='+tdName.textContent+'&price='+tdPrice.textContent+'&dptoCode='+selectDepartment[indexDepto].value);
                        x.onreadystatechange = function(){
                            if(x.status == 200 && x.readyState == 4){ 
                                if(x.responseText != '1'){
                                    swal({
                                        position: 'top-end',
                                        icon: 'error',
                                        title: x.responseText,
                                        showConfirmButton: false,
                                        timer: 1480
                                    })
                                }else{
                                    swal({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'Producto editado',
                                        showConfirmButton: false,
                                        timer: 1480
                                    })
                                }  
                            }
                        }
                        
                    }
                }
                editing = !editing;
            }
    
            //onclick delete
            deleteButton.onclick = function(){
                 //remover divs y enviar un request para eliminar este producto 
                 /////////SWAL
                 swal({
                    title: 'Eliminar ',
                    text: "Eliminar este producto?",
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
                        'Eliminado!',
                        ' ',
                        'success'
                      )
                    } 
                    //send to back end to deleted
                        var x = new XMLHttpRequest();
                        x.open('POST','http://192.168.100.195/Abarrotes/api/AllProducts.php',true);
                        x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
                        x.send('action=delete'+'&code='+product.code);
                        x.onreadystatechange = function(){
                            if(x.status == 200 && x.readyState == 4){ 
                                if(x.responseText != '1'){
                                    swal({
                                        position: 'top-end',
                                        icon: 'error',
                                        title: x.responseText,
                                        showConfirmButton: false,
                                        timer: 1300
                                    }) 
                                }else{
                                    swal({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'Producto eliminado',
                                        showConfirmButton: false,
                                        timer: 1300
                                    })
                                    trToDelete = document.getElementById('tr'+product.code)
                                    tableBody.removeChild(trToDelete)
                                }  
                            }
                        }

                  }) 
                .catch(()=>{
                    console.log("Operation just got canceled")
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
            tdBulk.innerHTML=product.bulk
            
            editButton.appendChild(editImage);
            deleteButton.appendChild(deleteImage);
            tdButton.appendChild(editButton)
            tdButton.appendChild(deleteButton)
            tr.appendChild(tdCode);
            tr.appendChild(tdName);
            tr.appendChild(tdPrice); 
            tr.appendChild(tdBulk); 
            tr.appendChild(tdDepartament);
            tr.appendChild(tdButton);
            tableBody.appendChild(tr);
        }
    });
}

function setSearchListener(){
    inputSearch = document.getElementById('input-search')
    inputSearch.addEventListener('keydown',()=>{ 
            search();
    })
}

function search(){ 
    var input, filter, found, table, tr, td, i, j;
    startLoader()
    input = document.getElementById('input-search');
    filter = input.value.toUpperCase();
    table = document.getElementById("tableBody");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
                stopLoader()
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false; 

        } else {
            tr[i].style.display = "none";
            stopLoader();
        }
    }
}

function stopLoader(){
    document.getElementById("loader").classList.remove('loader')
}
function startLoader(){
    document.getElementById("loader").classList.add('loader')
}