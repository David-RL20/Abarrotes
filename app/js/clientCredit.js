class Client {
    constructor(client) {
        this.id = client.number
        this.name = client.name
        this.limit = client.limit
        this.moneyUsed = client.total_used
        this.updateMoneyFree()
    }
    update() {
        let inputName = document.getElementById('inName' + this.id)
        let selectLimit = document.getElementById('select' + this.id)
        let index = selectLimit.selectedIndex
        let x = new XMLHttpRequest();
        x.open('POST', 'http://localhost/Abarrotes/api/AllClients.php')
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.send('action=update' + '&number=' + this.id + '&name=' + inputName.value + '&limit=' + selectLimit[index].value)
        x.onreadystatechange = function () {
            if (x.status == 200 && x.readyState == 4) {
                if (x.responseText != '1') {
                    swal({
                        position: 'top-end',
                        icon: 'error',
                        title: x.responseText,
                        showConfirmButton: false
                    })
                } else {
                    swal({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Cliente actualizado',
                        showConfirmButton: false,
                    })
                }
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            }
        }
    }
    pay() {
        let x = new XMLHttpRequest();
        x.open('POST', 'http://localhost/Abarrotes/api/AllSales_Credit.php')
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.send('action=delete' + '&client=' + this.id)
        x.onreadystatechange = function () {
            if (x.status == 200 && x.readyState == 4) {
                let answer = JSON.parse(x.responseText)
                if (answer.statusCode != 200) {
                    swal({
                        position: 'top-end',
                        icon: 'error',
                        title: x.responseText,
                        showConfirmButton: false
                    })
                } else {
                    swal({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Cliente pago',
                        showConfirmButton: false,
                    })
                }
            }
        }
    }
    updateMoneyFree() {
        this.moneyFree = this.limit - this.moneyUsed
    }

    getPurcharses() {
        x = new XMLHttpRequest();
        x.open('GET', 'http://localhost/Abarrotes/api/getSalesClient.php?client=' + this.id)
        x.send()
        x.onreadystatechange = () => {
            if (x.status == 200 && x.readyState == 4) {
                let sales = JSON.parse(x.responseText)
                if (sales != '' && typeof sale !== 'undefined') {
                    sales.forEach(sale => {
                        let div_collapse = document.getElementById('collapse' + this.id)
                        let days = new Array('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')
                        let months = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre')
                        let div = document.createElement('div')
                        let total_label = document.createElement('p')
                        let date_label = document.createElement('p')
                        let d = new Date(sale.date)
                        total_label.innerHTML = '<strong> Total : </strong> ' + sale.total
                        date_label.innerHTML = '<strong> Fecha : </strong>' + days[d.getDay()] + ' ,' + d.getDate() + ' ' + months[d.getMonth()];


                        div.classList.add('sale-info')
                        div.appendChild(total_label)
                        div.appendChild(date_label)
                        div_collapse.appendChild(div)

                    });
                } else {
                    let div_collapse = document.getElementById('collapse' + this.id)
                    div_collapse.innerHTML = 'No hay ninguna venta'
                }
            }

        }
    }

}

function init() {
    getClients();
}

function getClients() {
    x = new XMLHttpRequest();
    x.open('GET', 'http://localhost/Abarrotes/api/AllClients.php')
    x.send()
    x.onreadystatechange = function () {
        if (x.status == 200 && x.readyState == 4) {
            let clients = JSON.parse(x.responseText)
            clients.forEach(client => {
                if (client.number != 1) {
                    addClient(client)
                }
            });
            let loader = document.getElementById('loader')
            loader.classList.remove('loader')
        }

    }
}

function addClient(_client) {
    let client = new Client(_client)
    let div_card = document.createElement('div'),
        div_card_header = document.createElement('div'),
        div_card_body = document.createElement('div'),
        h4 = document.createElement('h4'),
        wrapper = document.getElementById('wrapper'),
        h5 = document.createElement('h5'),
        strong = document.createElement('strong'),
        btn_primary = document.createElement('button'),
        btn_pay = document.createElement('button'),
        btn_link = document.createElement('button'),
        div_collapse = document.createElement('div')
    //classes
    div_card.classList.add('card')
    div_card_header.classList.add('card-header')
    div_card_body.classList.add('card-body')
    btn_primary.classList.add('btn')
    btn_primary.classList.add('btn-primary')
    btn_pay.classList.add('btn')
    btn_pay.classList.add('btn-success')
    btn_link.classList.add('btn')
    btn_link.classList.add('btn-link')
    div_collapse.classList.add('collapse')
    div_collapse.classList.add('card')
    div_collapse.classList.add('card-body')
    //id collapse
    div_collapse.id = 'collapse' + client.id

    client.getPurcharses();

    btn_pay.addEventListener('click', () => {
        client.pay();
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    })
    //data
    h4.innerHTML = client.name
    strong.innerHTML = '$' + client.moneyUsed
    h5.innerHTML = 'Adeudo :'
    btn_pay.innerHTML = 'Pagar'
    btn_primary.innerHTML = 'ver compras'
    btn_primary.dataset.toggle = 'collapse'
    btn_primary.dataset.target = '#collapse' + client.id
    btn_link.innerHTML = 'Ver mas'


    //append
    h5.appendChild(strong)
    div_card_body.appendChild(h5)
    div_card_body.appendChild(btn_primary)
    div_card_body.appendChild(btn_pay)
    div_card_body.appendChild(btn_link)
    div_card_body.appendChild(div_collapse)
    div_card_header.appendChild(h4)
    div_card.appendChild(div_card_header)
    div_card.appendChild(div_card_body)
    wrapper.appendChild(div_card)
}