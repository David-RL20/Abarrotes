const CLIENTS_API = "http://localhost/Abarrotes/api/AllClients.php"
const URL_SALES_API = 'http://localhost/Abarrotes/api/AllSales.php'

async function getClients() {
    const request = await fetch(CLIENTS_API)
    const clients = await request.json();
    let select = document.getElementById('select-client')
    clients.forEach(client => {
        //add to list
        select.insertAdjacentHTML('afterbegin',
            `<option value=${client.number} data-limit=${client.limit} data-used=${client.used} >
                ${client.name}
            </option>`)
    });
}

async function getSales() {
    let request = await fetch(URL_SALES_API);
    let sales = await request.json();
    sales.forEach(sale => {
        addSaleToTable(sale);
    });
}

function init() {
    getSales()
    getClients()
    addListeners()
}

function addSaleToTable(sale) {
    let tableBody, date, month
    //GET TABLE BODY
    tableBody = document.getElementById('table-body');
    //GET DATE
    date = new Date(sale.date)
    if ((date.getMonth() + 1) < 10) {
        month = 0 + '' + (date.getMonth() + 1)
    } else {
        month = (date.getMonth() + 1)
    }

    //INNER HTML
    tableBody.insertAdjacentHTML('beforebegin',
        `<tr> 
            <td>${sale.id}</td>
            <td>${sale.client}</td>
            <td>${date.getDate()}-${month}-${date.getFullYear()}</td> 
            <td>$ ${sale.total}</td> 
            <td>
                <button class='btn btn-link' onclick='window.location = "products_sale.html?sale=${sale.id}"'> 
                    Ver detalles
                </button> 
            </td> 
        </tr>`)
}

function addListeners() {
    let select = document.getElementById('select-client')
    let input = document.getElementById('input_sale_number')

    select.addEventListener('change', function () {
        if (select[select.selectedIndex].value != 0) {
            searchByClient(select[select.selectedIndex].value)
        } else {
            showAll()
        }
    })
    input.addEventListener('keypress', function () {
        searchByNumber(input.value)
    })
}

function searchByClient(client) {
    console.log("buscando por cliente : " + client)
    var found, table, tr, td, i;
    table = document.getElementById("table-body");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (td[1].innerHTML.toUpperCase().indexOf(client) > -1) {
            found = true;
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}

function searchByNumber(number) {
    console.log("buscando por venta : " + number)
    var found, table, tr, td, i;
    table = document.getElementById("table-body");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (td[0].innerHTML.toUpperCase().indexOf(number) > -1) {
            found = true;
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}

function showAll() {
    var table, tr, i
    table = document.getElementById("table-body");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
    }
}