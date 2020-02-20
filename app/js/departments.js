function init(){
    getDepartment();
    var tableBody = document.getElementById('tableBody');
    var departments= JSON.parse(sessionStorage.departments);

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

function getDepartment(){
   // Ask for all the products
   x= new XMLHttpRequest();
   x.open('GET','http://localhost/Abarrotes/api/AllDepartments.php')
   x.send()
   x.onreadystatechange = function(){
       if(x.status == 200 && x.readyState == 4){
           sessionStorage.departments = x.responseText;
       }
   }
}