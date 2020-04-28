function init() {
    console.log('intializing document...');
    document.getElementById('inputNameProduct').focus();
    //add deparments to the list
    addDepartments();

}
//when you click on the button save data in database
function save() {
    var url = 'http://localhost/Abarrotes/api/AllProducts.php ';
    var name = document.getElementById('inputNameProduct').value;
    var code = document.getElementById('inputCodeProduct').value;
    var price = document.getElementById('inputPriceproduct').value;
    var bulk = document.getElementById('ventaGranel').value;
    var depto = document.getElementById('selectDepartmentProduct').value;
    var x = new XMLHttpRequest();
    x.open('POST', url, true);
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    x.send('action=post&' + 'code=' + code + '&bulk=' + bulk + '&name=' + name + '&price=' + price + '&dptoCode=' + depto);
    x.onreadystatechange = function () {
        if (x.status == 200 && x.readyState == 4) {
            if (x.responseText != '1') {
                swal({
                    position: 'top-end',
                    icon: 'error',
                    title: x.responseText,
                    showConfirmButton: false,
                    timer: 1480
                })
            } else {
                swal({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto agregado de manera exitosa',
                    showConfirmButton: false,
                    timer: 1480
                })
            }
            setTimeout(function () {
                window.location.reload(true)
            }, 1500)
        }
    }
}

//clear all values in html
function clearValues() {
    document.getElementById('inputNameProduct').value = '';
    document.getElementById('inputCodeProduct').value = '';
    document.getElementById('inputPriceproduct').value = '';
    document.getElementById('ventaGranel').value = 'no';
    document.getElementById('selectDepartmentProduct').value = '';
}

//add the departments to the options 
function addDepartments() {
    var x = new XMLHttpRequest();
    var url = 'http://localhost/Abarrotes/api/AllDepartments.php'

    var depto = document.getElementById('selectDepartmentProduct');
    x.open('GET', url);
    x.send();
    x.onreadystatechange = function () {
        if (x.status == 200 && x.readyState == 4) {
            // console.log(x.responseText)
            var deptos = JSON.parse(x.responseText);
            deptos.forEach(dept => {
                var option = document.createElement('option');
                option.value = dept.code
                option.textContent = dept.name

                depto.appendChild(option)
            });
        }
    }
}

function bulkBotton() {
    var bulk = document.getElementById('ventaGranel');
    if (bulk.value == 'si') {
        bulk.value = 'no';

    } else if (bulk.value == 'no') {
        bulk.value = 'si';
    }
    console.log(bulk.value)
}