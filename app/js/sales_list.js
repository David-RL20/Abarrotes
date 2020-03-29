const CLIENTS_API = "http://192.168.100.195/Abarrotes/api/AllClients.php"
const URL_SALES_API = 'http://192.168.100.195/Abarrotes/api/AllSales.php'
function getClients(){
    let x= new XMLHttpRequest();
    x.open('GET',CLIENTS_API)
    x.send()
    x.onreadystatechange = function(){
        let select = document.getElementById('select-client')
        if(x.status == 200 && x.readyState == 4){
            let clients = JSON.parse(x.responseText)
            clients.forEach(client => {
                //add to list
                let option = document.createElement('option')
                option.innerHTML = client.name
                option.value = client.number
                option.dataset.limit = client.limit
                option.dataset.used = client.total_used 
                select.appendChild(option)
            });
        } 
        
    } 
}
function getSales(){
    let x= new XMLHttpRequest();
    x.open('GET',URL_SALES_API)
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            if(x.responseText != '' && typeof x.responseText !== 'undefined'){ 
                let sales = JSON.parse(x.responseText)  
                sales.forEach(sale => {
                    addSaleToTable(sale)
                });
            }
        }
    }
}

function init(){
    getSales()
    getClients()
    addListeners()
}

function addSaleToTable(sale){
    let tdNumber , tdClient,tdDate,tdTotal,tdAction,tr,selectAction,tableBody,date,month

    tableBody = document.getElementById('table-body')
    tr = document.createElement('tr')
    tdNumber = document.createElement('td')
    tdClient = document.createElement('td')
    tdDate = document.createElement('td')
    tdTotal = document.createElement('td')
    tdAction = document.createElement('td')
    selectAction = document.createElement('select')

    date = new Date(sale.date)
    if((date.getMonth() + 1) < 10){
        month =  0+''+(date.getMonth() + 1)
    } else{
        month = (date.getMonth() + 1)
    }
    tdNumber.innerHTML = sale.id
    tdClient.innerHTML = sale.client
    tdDate.innerHTML = date.getDate() +'-'+ month + '-'+date.getFullYear()
    tdTotal.innerHTML = '$'+ sale.total

    //actions 


    tdAction.appendChild(selectAction)
    tr.appendChild(tdNumber)
    tr.appendChild(tdClient)
    tr.appendChild(tdDate)
    tr.appendChild(tdTotal)
    tr.appendChild(tdAction)
    tableBody.appendChild(tr)
}

function addListeners(){
    let select =document.getElementById('select-client')
    let input = document.getElementById('input_sale_number')

    select.addEventListener('change',function(){ 
            searchByClient(select[select.selectedIndex].value) 
    }) 
    input.addEventListener('keypress',function(){ 
        searchByNumber(input.value)  
    })
}
function searchByClient(client){
    console.log("buscando por cliente : "+client)
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
function searchByNumber(number){
    console.log("buscando por venta : "+number)
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