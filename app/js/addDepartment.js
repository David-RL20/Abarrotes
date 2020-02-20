function init(){
    console.log('initializing docuent...')

}

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
function clear(){
     document.getElementById('codeDepto').value = '';
    document.getElementById('nameDepto').value = '';
}