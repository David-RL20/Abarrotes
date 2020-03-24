function init(){
    addDepartments();
    verifyCode();
}

//add the departments to the options 
function addDepartments(){
    var x = new XMLHttpRequest();
    var url='http://192.168.100.195/Abarrotes/api/AllDepartments.php'

    var depto = document.getElementById('selectDepartmentProduct');
    x.open('GET',url);
    x.send();
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            // console.log(x.responseText)
            var deptos= JSON.parse(x.responseText);
            deptos.forEach(dept => {
                //Table body
                body = document.getElementById('body');
                //tr
                tr = document.createElement('tr');
                tr.id='tr'+dept.code
                //Creating td
                tdCode = document.createElement('td')
                tdName = document.createElement('td')
                tdAction = document.createElement('td')
                //Inner information
                tdCode.innerHTML = dept.code
                tdName.innerHTML = dept.name
                tdName.id= 'name'+dept.code

                //image 
                imgDelete = document.createElement('img')
                imgEdit = document.createElement('img')
                    //src
                    imgDelete.src="images/delete.png"
                    imgEdit.src="images/edit.png"

                    //css
                    imgDelete.className="image"
                    imgEdit.className="image"
                    //onclick delete
                    imgDelete.onclick = function(){
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
                            if(result){
                                    tr2 = document.getElementById('tr'+dept.code);
                                    body.removeChild(tr2)
                                    x = new XMLHttpRequest();
                                    url='http://192.168.100.195/Abarrotes/api/AllDepartments.php'
                                    x.open('GET',url+'?delete='+dept.code);
                                    x.send();
                                    x.onreadystatechange = function(){
                                    console.log("Respuesta" + x.responseText);
                                }
                            }
                          }) 
                        .catch(()=>{
                            console.log("se cancela la cancelacion")
                        })                     
                    }
                    //onclick update
                    update = false;
                    imgEdit.addEventListener('click',function(){
                        if(!update){
                            imgEdit.src='images/save.png'
                            //is updating
                            tdName = document.getElementById('name'+dept.code)
                            input = document.createElement('input')
                            input.value = tdName.textContent;
                            input.id="input"+dept.code
                            tdName.innerHTML="";
                            tdName.appendChild(input)
 
                        }else if(update){
                            //ready to update
                            imgEdit.src='images/edit.png'
                            input = document.getElementById('input'+dept.code);
                            tdName = document.getElementById('name'+dept.code);
                            tdName.innerHTML = input.value;
                            
                            code = dept.code;
                            name = tdName.textContent;
                            //send a PUT request to all departments to edit the name of the department
                            x= new XMLHttpRequest();
                            url= 'http://192.168.100.195/Abarrotes/api/AllDepartments.php'
                            x.open('GET',url+'?update='+code+'&name='+name,true)
                            x.send();
                            x.onreadystatechange = function(){
                                if(x.status == 200 && x.readyState == 4){
                                    answer = JSON.parse(x.responseText);
                                    if(answer.status == 1){
                                        console.log("Modificado de manera");
                                    }else{
                                        swal({
                                            position: 'top-end',
                                            icon: 'error',
                                            title: answer.message,
                                            showConfirmButton: false,
                                            timer: 5000
                                          })
                                    }
                                }
                            }
                                                

                        }

                        update = !update; 
                    }) 

                    //appendChild
                    tdAction.appendChild(imgEdit);
                    tdAction.appendChild(imgDelete);
                
                //append tds
                tr.appendChild(tdCode)
                tr.appendChild(tdName)
                tr.appendChild(tdAction)

                //append tr to body
                body.appendChild(tr);


            });
        }
    }
}

function save(){
    var code = document.getElementById('codeDepto').value;
    var name = document.getElementById('nameDepto').value;
    if(code != '' && name != ''){
        x= new XMLHttpRequest();
        url= 'http://192.168.100.195/Abarrotes/api/AllDepartments.php'
        x.open('POST',url,true)
        x.setRequestHeader('Content-type','application/x-www-form-urlencoded')
        x.send('code='+code+'&'+'name='+name);
        x.onreadystatechange = function(){
            if(x.status == 200 && x.readyState == 4){
                answer = JSON.parse(x.responseText); 
                if(answer.status = 1){
                    swal({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Departamento agregado de manera exitosa',
                        showConfirmButton: false,
                        timer: 2000
                      })
                    clear(); 
                }else{
                    swal({
                        position: 'top-end',
                        icon: 'error',
                        title: answer.message,
                        showConfirmButton: false,
                        timer: 5000
                      })
                    clear();
                }
                
            }
        }
    }else{
        swal({
            position: 'top-end',
            icon: 'error',
            title: 'El codigo y departamento no deben estar vacios',
            showConfirmButton: false,
            timer: 3000
          })
    }
}

function clear(){
     document.getElementById('codeDepto').value = '';
     document.getElementById('nameDepto').value ='';
     setTimeout(() => {
        location.reload();
     }, 2000);
}

function verifyCode(){
    input = document.getElementById('codeDepto')
    input.addEventListener("keypress",function(){
        if(input.value.length >= 5){
            swal({
                position: 'top-end',
                icon: 'error',
                title: 'El maximo de un codigo es 5 letras o numeros',
                showConfirmButton: false,
                timer: 3000
              })
        }
    })
}