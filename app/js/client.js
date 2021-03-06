const CLIENT_API = 'http://localhost/Abarrotes/api/AllClients.php';
let options = [{
    value: 0,
    textContent: '$0'
}, {
    value: 50.00,
    textContent: '$50'
}, {
    value: 100.00,
    textContent: '$100'
}, {
    value: 200.00,
    textContent: '$200'
}, {
    value: 300.00,
    textContent: '$300'
}, {
    value: 400.00,
    textContent: '$400'
}, {
    value: 500.00,
    textContent: '$500'
}, {
    value: 600.00,
    textContent: '$600'
}, {
    value: 700.00,
    textContent: '$700'
}, {
    value: 800.00,
    textContent: '$800'
}, {
    value: 900.00,
    textContent: '$900'
}, {
    value: 1000.00,
    textContent: '$1000'
}]
class Client {
    constructor(client) {
        this.id = client.number
        this.name = client.name
        this.limit = client.limit
        this.moneyUsed = client.total_used
        this.updateMoneyFree()
    }
    async update() {
        let limit = document.getElementById('select' + this.id)[document.getElementById('select' + this.id).selectedIndex].value
        let name = document.querySelector('#inName' + this.id).value
        const request = await fetch(CLIENT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=update&number=${this.id}&name=${name}&limit=${limit}`
        });
        let answer = await request.json();
        if (answer !== 1) {
            swal({
                position: 'top-end',
                icon: 'error',
                title: answer,
                showConfirmButton: false
            })
        } else {
            swal({
                position: 'top-end',
                icon: 'success',
                title: 'Cliente actualizado',
                showConfirmButton: false,
            })
            setTimeout(() => {
                location.reload();
            }, 700)
        }
    }

    updateMoneyFree() {
        this.moneyFree = this.limit - this.moneyUsed
    }

}

function init() {
    getClients()
    addSearchListener();
}

async function getClients() {
    const request = await fetch(CLIENT_API);
    const clients = await request.json();
    clients.forEach(client => {
        if (client.number != 1) {
            addClientToTable(client)
        }
    });
    document.querySelector('#loader').classList.remove('loader')
}

function addClientToTable(_client) {
    let client = new Client(_client)
    let tableBody = document.getElementById('tableBody');
    tableBody.insertAdjacentHTML('afterbegin', `
        <tr> 
            <td >${client.id}</td>
            <td id='name${client.id}' >${client.name}</td>
            <td id='limit${client.id}'>$ ${ client.limit}</td>
            <td>$ ${client.moneyUsed}</td>
            <td>$ ${client.moneyFree}</td>
            <td> 
                <button id='btn-delete-${client.id}' class='btn btn-outline-danger'> <img id='delete${client.id}' src='images/delete_red.png'> </image></button >
                <button id='btn-edit-${client.id}' class='btn btn-outline-primary' > <img id='edit${client.id}' src='images/edit_blue.png'> </image></button >
            </td>
        </tr>
    `);
    //Get imgs and btns
    let btnDelete = document.querySelector(`#btn-delete-${client.id}`),
        btnEdit = document.querySelector(`#btn-edit-${client.id}`),
        imgDelete = document.querySelector(`#delete${client.id}`),
        imgEdit = document.querySelector(`#edit${client.id}`)

    // on mouse over
    btnEdit.addEventListener('mouseover', () => {
        imgEdit.src = 'images/edit_white.png'
    })
    btnDelete.addEventListener('mouseover', () => {
        imgDelete.src = 'images/delete_white.png'
    })

    //on mouse out
    btnEdit.addEventListener('mouseout', () => {
        imgEdit.src = 'images/edit_blue.png'
    })
    btnDelete.addEventListener('mouseout', () => {
        imgDelete.src = 'images/delete_red.png'
    })

    let editing = false;
    btnEdit.addEventListener('click', () => {
        if (!editing) {
            let string_options;
            for (let i = 0; i < options.length; i++) {
                //client limit asigned is iqual to value of option
                (client.limit == options[i].value) ?
                //insert option as selected
                string_options += `<option selected value=${options[i].value}> ${options[i].textContent} </option>`:
                    string_options += `<option value=${options[i].value}> ${options[i].textContent} </option>`

            }
            //Inner inputs and selected into td
            document.querySelector(`#limit${client.id}`).innerHTML = `<select id='select${client.id}'>${string_options} </select>`
            document.querySelector(`#name${client.id}`).innerHTML = `<input id = 'inName${client.id}'  value=${client.name}> </input>`
        } else {
            client.update()
        }

        editing = !editing;
    })

    btnDelete.addEventListener('click', () => {
        swal({
            position: 'top-end',
            icon: 'error',
            title: `No se puede eliminar cliente
            si es necesario baja su credito a $0 pesos`,
            showConfirmButton: false
        })
    })

}

function addSearchListener() {
    let input = document.getElementById('inputSearch'),
        btnSearch = document.getElementById('btn-search')

    input.addEventListener('keypress', search)
    btnSearch.addEventListener('click', search)
}

function search() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById('inputSearch');
    filter = input.value.toUpperCase();
    table = document.getElementById("tableBody");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}

async function add() {
    let input = document.getElementById('name')
    let select = document.getElementById('selectLimit')
    if (input.value != '' && select[select.selectedIndex].value != 0) {
        const request = await fetch(CLIENT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=post&name=${input.value}&limit=${select[select.selectedIndex].value}`
        });
        const answer = await request.json();
        debugger
        if (answer !== 1) {
            swal({
                position: 'top-end',
                icon: 'error',
                title: answer,
                showConfirmButton: false
            })
        } else {
            swal({
                position: 'top-end',
                icon: 'success',
                title: 'Cliente agregado de manera exitosa',
                showConfirmButton: false,
                timer: 1480
            })
            setTimeout(() => {
                window.location.reload()
            }, 1500);
        }

    } else {
        swal({
            position: 'top-end',
            icon: 'error',
            title: 'Limite y nombre deben ser asignados',
            showConfirmButton: false
        })
    }
}