const CLIENTS_API = 'http://localhost/Abarrotes/api/AllClients.php';
const SALES_CREDIT_API = 'http://localhost/Abarrotes/api/AllSales_Credit.php';

class Client {
    constructor(client) {
        this.id = client.number
        this.name = client.name
        this.limit = client.limit
        this.moneyUsed = client.total_used
        this.updateMoneyFree()
    }
    async pay() {
        //send request to pay this client
        const request = await fetch(SALES_CREDIT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=delete&client=${this.id}`
        });
        //parse answer to json
        const answer = await request.json()

        if (answer.statusCode === 200) {
            swal({
                position: 'top-end',
                icon: 'success',
                title: 'Cliente pago',
                showConfirmButton: false,
            })
            //reload if successfully
            setTimeout(() => {
                window.location.reload()
            }, 200)
        } else {
            swal({
                position: 'top-end',
                icon: 'error',
                title: x.responseText,
                showConfirmButton: false
            })
        }
    }
    updateMoneyFree() {
        this.moneyFree = this.limit - this.moneyUsed
    }


}


async function getClients() {
    const answer = await fetch(CLIENTS_API);
    const clients = await answer.json()
    clients.forEach(client => {
        if (client.number != 1) {
            addClient(client)
        }
    });
}


function init() {
    getClients();
}

function addClient(_client) {
    const client = new Client(_client)
    //insert into wrapper card  
    let wrapper = document.getElementById('wrapper')
    wrapper.insertAdjacentHTML('afterbegin',
        `<div class='card' >
            <div class='card-header'>
                <h4>${client.name}</h4>
            </div>
            <div class='card-body'>
                <h5> Adeudo: <strong > $ ${client.moneyUsed} </strong> </h5 >
                <button class ='btn btn-primary'> Ver compras </button>
                <button class = 'btn btn-success' id='btn-pay-${client.id}'> Pagar </button>
                <button class='btn btn-link' >Ver mas </button>
            </div>
        </div>`);
    //GET btn pay and set onclick event
    let btn_pay = document.querySelector(`#btn-pay-${client.id}`);
    btn_pay.addEventListener('click', () => {
        client.pay();
    })
}