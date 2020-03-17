function init(){
    addDepartments();
    verifyCode();
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
                        //Alerta para confirmar la eliminacion
                        if (confirm("Si eliminas un departamento es probable que elimines algun producto")) {
                            tr2 = document.getElementById('tr'+dept.code);
                            body.removeChild(tr2)
                            x = new XMLHttpRequest();
                            url='http://localhost/Abarrotes/api/AllDepartments.php'
                            x.open('GET',url+'?delete='+dept.code);
                            x.send();
                            x.onreadystatechange = function(){
                            console.log("Respuesta" + x.responseText);
                        } 
                        } else {
                        txt = "You pressed Cancel!";
                        }                       
                    }
                    //onclick update
                    update = false;
                    imgEdit.onclick = function(){
                        if(!update){
                            //is updating
                            imgEdit.src='images/save.png'
                            input = document.createElement('input')
                            input.value = tdName.textContent;
                            input.id="input"+dept.code
                            tdName.innerHTML="";
                            tdName.appendChild(input)
 
                        }else if(update){
                            //ready to update
                            imgEdit.src='images/edit.png'
                            input = document.getElementById('input'+dept.code);
                            tdName.innerHTML = input.value;
                            
                            code = dept.code;
                            name = tdName.textContent;
                            //send a PUT request to all departments to edit the name of the department
                            x= new XMLHttpRequest();
                            url= 'http://localhost/Abarrotes/api/AllDepartments.php'
                            x.open('GET',url+'?update='+code+'&name='+name,true)
                            x.send();
                            x.onreadystatechange = function(){
                                if(x.status == 200 && x.readyState == 4){
                                    answer = JSON.parse(x.responseText);
                                    if(answer.status == 1){
                                        console.log("Modificado de manera");
                                    }else{
                                        alert(answer.message);
                                    }
                                }
                            }
                                                

                        }

                        update = !update;
                        console.log(update)
                    }

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
        url= 'http://localhost/Abarrotes/api/AllDepartments.php'
        x.open('POST',url,true)
        x.setRequestHeader('Content-type','application/x-www-form-urlencoded')
        x.send('code='+code+'&'+'name='+name);
        x.onreadystatechange = function(){
            if(x.status == 200 && x.readyState == 4){
                answer = JSON.parse(x.responseText);
                console.log(answer);
                if(answer.status = 1){
                    alert('Departamento agregado de manera exitosa!');
                    clear(); 
                }else{
                    alert(answer.message);
                    clear();
                }
                
            }
        }
    }else{
        alert('El codigo y nombre de departamento no bene estar vacios');
    }
}

function clear(){
     document.getElementById('codeDepto').value = '';
     document.getElementById('nameDepto').value ='';
     location.reload();
}

function verifyCode(){
    input = document.getElementById('codeDepto')
    input.addEventListener("keypress",function(){
        if(input.value.length >= 5){
            alert("El codigo debe tener maximo 5 caracteres o letras \n \n \n Porfavor reingrese el codigo");
        }
    })
}