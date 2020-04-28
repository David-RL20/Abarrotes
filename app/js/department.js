function init() {
    addDepartments();
    verifyCode();
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
                //Table body
                body = document.getElementById('body');
                //tr
                tr = document.createElement('tr');
                tr.id = 'tr' + dept.code
                //Creating td
                tdCode = document.createElement('td')
                tdName = document.createElement('td')
                tdAction = document.createElement('td')
                btnDelete = document.createElement('button')
                btnEdit = document.createElement('button')
                //Inner information
                tdCode.innerHTML = dept.code
                tdName.innerHTML = dept.name
                tdName.id = 'name' + dept.code
                btnEdit.classList.add('btn-outline-primary')
                btnDelete.classList.add('btn-outline-danger')
                btnEdit.classList.add('btn')
                btnDelete.classList.add('btn')
                //image 
                imgDelete = document.createElement('img')
                imgEdit = document.createElement('img')

                imgEdit.id = 'edit' + dept.code
                imgDelete.id = 'delete' + dept.code
                //src
                imgDelete.src = "images/delete_red.png"
                imgEdit.src = "images/edit_blue.png"

                //css
                imgDelete.classList.add('image')
                imgEdit.classList.add('image')

                //onclick delete
                btnDelete.onclick = function () {
                    swal({
                            title: 'Producto',
                            text: "Desea eliminar este producto?",
                            icon: 'warning',
                            color: '#123',
                            buttons: [
                                'No, cancelar',
                                '  Si  '
                            ],
                            cancel: 'cancelar'
                        })
                        .then((result) => {
                            if (result) {
                                tr2 = document.getElementById('tr' + dept.code);
                                body.removeChild(tr2)
                                x = new XMLHttpRequest();
                                url = 'http://localhost/Abarrotes/api/AllDepartments.php'
                                x.open('GET', url + '?delete=' + dept.code);
                                x.send();
                                x.onreadystatechange = function () {
                                    console.log("Respuesta" + x.responseText);
                                }
                            }
                        })
                        .catch(() => {
                            console.log("se cancela la cancelacion")
                        })
                }
                //onclick update
                update = false;
                btnEdit.addEventListener('click', function () {
                    if (!update) {
                        //is updating
                        tdName = document.getElementById('name' + dept.code)
                        input = document.createElement('input')
                        input.value = tdName.textContent;
                        input.id = "input" + dept.code
                        tdName.innerHTML = "";
                        tdName.appendChild(input)

                    } else if (update) {
                        //ready to update 
                        input = document.getElementById('input' + dept.code);
                        tdName = document.getElementById('name' + dept.code);
                        tdName.innerHTML = input.value;

                        code = dept.code;
                        name = tdName.textContent;
                        //send a PUT request to all departments to edit the name of the department
                        x = new XMLHttpRequest();
                        url = 'http://localhost/Abarrotes/api/AllDepartments.php'
                        x.open('GET', url + '?update=' + code + '&name=' + name, true)
                        x.send();
                        x.onreadystatechange = function () {
                            if (x.status == 200 && x.readyState == 4) {
                                answer = JSON.parse(x.responseText);
                                if (answer.status == 1) {
                                    console.log("Modificado de manera");
                                } else {
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

                btnEdit.addEventListener('mouseover', function () {
                    imgEdit = document.getElementById('edit' + dept.code);
                    imgEdit.src = 'images/edit_white.png'
                })
                btnDelete.addEventListener('mouseover', function () {
                    imgDelete = document.getElementById('delete' + dept.code);
                    imgDelete.src = 'images/delete_white.png'
                })
                btnEdit.addEventListener('mouseout', function () {
                    imgEdit = document.getElementById('edit' + dept.code);
                    imgEdit.src = 'images/edit_blue.png'
                })
                btnDelete.addEventListener('mouseout', function () {
                    imgDelete = document.getElementById('delete' + dept.code);
                    imgDelete.src = 'images/delete_red.png'
                })

                btnDelete.appendChild(imgDelete)
                btnEdit.appendChild(imgEdit)
                //appendChild
                tdAction.appendChild(btnDelete);
                tdAction.appendChild(btnEdit);

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

function save() {
    var code = document.getElementById('codeDepto').value;
    var name = document.getElementById('nameDepto').value;
    if (code != '' && name != '') {
        x = new XMLHttpRequest();
        url = 'http://localhost/Abarrotes/api/AllDepartments.php'
        x.open('POST', url, true)
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        x.send('code=' + code + '&' + 'name=' + name);
        x.onreadystatechange = function () {
            if (x.status == 200 && x.readyState == 4) {
                answer = JSON.parse(x.responseText);
                if (answer.status = 1) {
                    swal({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Departamento agregado de manera exitosa',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    clear();
                } else {
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
    } else {
        swal({
            position: 'top-end',
            icon: 'error',
            title: 'El codigo y departamento no deben estar vacios',
            showConfirmButton: false,
            timer: 3000
        })
    }
}

function clear() {
    document.getElementById('codeDepto').value = '';
    document.getElementById('nameDepto').value = '';
    setTimeout(() => {
        location.reload();
    }, 2000);
}

function verifyCode() {
    input = document.getElementById('codeDepto')
    input.addEventListener("keypress", function () {
        if (input.value.length >= 5) {
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