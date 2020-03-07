function init(){
    refreshDepartments();
}

//Get all departments in the database and return them
function getDepartment(){
   // Ask for all the products
   x= new XMLHttpRequest();
   x.open('GET','http://localhost/Abarrotes/api/AllDepartments.php')
   x.send()
   x.onreadystatechange = function(){
       if(x.status == 200 && x.readyState == 4){
           return x.responseText;
       }
   }
}

//Update the departments table with an request to the API
function refreshDepartments(){
    var tableBody = document.getElementById('tableBody');
    var departments= getDepartment();

    contador=0
    departments.forEach(depto => {
        contador++;
        tr= document.createElement('tr')
        tdName=document.createElement('td')
        tdCode=document.createElement('td')
        tdNum=document.createElement('td')

        tdNum.innerHTML=contador
        tdName.innerHTML=depto.name
        tdCode.innerHTML=depto.code

        tr.appendChild(tdNum)
        tr.appendChild(tdCode)
        tr.appendChild(tdName)

        tableBody.appendChild(tr);
    });
}

//sends all input's data to the API
function save(){
    var code = document.getElementById('codeDepto').value;
    var name = document.getElementById('nameDepto').value;

    x= new XMLHttpRequest();
    url= 'http://localhost/Abarrotes/api/AllDepartments.php'
    x.open('POST',url)
    x.setRequestHeader('Content-type','application/x-www-form-urlencoded')
    x.send('code='+code+'&'+'name='+name);
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            if(x.responseText != 1){
                alert('Departamento existente !');
                clear()
            }else{
                alert('Departamento agregado de manera exitosa!');
                clear();
            }
            console.log(x.responseText)
        }
    }
}

//Clears all the values
function clear(){
     document.getElementById('codeDepto').value = '';
    document.getElementById('nameDepto').value = '';
}