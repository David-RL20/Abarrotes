
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
            console.log(x.responseText)
            if(x.responseText != '1'){
                alert('Producto existente !');
                clearValues()
            }else{
                alert('Producto agregado de manera exitosa!');
                clearValues();
            }
        }
    }



}

//clear all values in html
function clearValues(){
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