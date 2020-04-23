const ID_INPUT_CODE = 'inputCodeProduct'
const ID_DATALIST = 'dataListProducts'
const ID_TABLE_BODY = "tableBody";
const ID_TOTAL_LABEL = "totalCurrently";
const ID_TOTAL_LABEL_WINDOW = "label-total-window";
const BTN_FINISH_SALE = 'btn-finish-sale'
const ID_LABEL_CHANGE_MISSING = 'lab-change-missing'
const PRODUCTS_API = "http://localhost/Abarrotes/api/AllProducts.php"
const CLIENTS_API = "http://localhost/Abarrotes/api/AllClients.php"
const URL_SALES_API = 'http://localhost/Abarrotes/api/AllSales.php';
const URL_PROD_SALE_API = 'http://localhost/Abarrotes/api/AllProducts_Sell.php';
const URL_SALE_CREDIT_API = 'http://localhost/Abarrotes/api/AllSales_Credit.php';

class Product {
    constructor() {
        this.car = new Array()
        this.client = 1;
        this.getProducts()
        this.getClients()
        this.addInputListener()
        this.addChargeSellListener()
        this.resetProduct()
        this.addShortCutListeners()
    }

    async getProducts() {
        let answer = await fetch(PRODUCTS_API);
        this.products = await answer.json();
        this.addProductsToDataList()
    }
    addProductsToDataList() {
        let list = document.getElementById(ID_DATALIST)
        this.products.forEach(product => {
            let option = document.createElement('option');
            option.value = product.code;
            option.innerHTML = product.name;
            list.appendChild(option);
        });
    }
    addInputListener() {
        let input = document.getElementById(ID_INPUT_CODE);
        input.focus();
        input.addEventListener("keypress", () => {
            if (event.keyCode == '13') {
                if (input.value != '') {
                    let array = this.moreProducts(input.value);
                    if (typeof array !== 'undefined') {
                        //get the values of code an quantity if * on input
                        this.quantity = array[0]
                        this.code = array[1]
                        this.verification();
                    } else {
                        this.code = input.value
                        this.verification()
                    }
                } else {
                    this.openPopUpSell();
                }
            }
        });
        this.addCancelListener()
    }
    async verification() {
        //Verify if the product exist 
        const p = await this.existProduct();
        if (p) {
            var existing = this.verifyIsInCar();
            if (!existing) {
                //add to cart
                this.price = p.price
                this.name = p.name
                //#region confirmation for quantity
                if (p.bulkSale == 'si' && typeof this.quantity == 'undefined') {
                    //metodo que muestra un popup y regresa el valor del input
                    //vere si lo puedo hacer con una promesa
                    this.setPopUpListener()
                    this.showQuantityPopUp();
                    this.verifyQuantityBulk();
                    this.resetInput();
                    return;
                }
                if (p.bulkSale == 'no' && typeof this.quantity == 'undefined') {
                    this.quantity = 1;
                    this.subtotal = this.quantity * this.price
                    this.addToCar();
                    this.updateTotal();
                    this.addToTable();
                    this.resetProduct();
                    this.resetInput();
                    return;
                }
                if (p.bulkSale == 'no' && typeof this.quantity !== 'undefined') {
                    this.subtotal = this.quantity * this.price
                    this.addToCar();
                    this.updateTotal();
                    this.addToTable();
                    this.resetProduct();
                    this.resetInput();
                    return;
                }
                //#endregion

            } else {
                //#region confirmation for quantity
                if (p.bulkSale == 'si' && typeof this.quantity == 'undefined') {
                    //metodo que muestra un popup y regresa el valor del input
                    //vere si lo puedo hacer con una promesa
                    this.showQuantityPopUp();
                    this.verifyQuantityBulk();
                    this.setPopUpListener()
                    this.resetInput();
                    return;
                }
                if (p.bulkSale == 'no' && typeof this.quantity == 'undefined') {
                    this.quantity = 1;
                    this.subtotal = this.quantity * this.price
                    this.updateCart();
                    this.updateTable();
                    this.updateTotal();
                    this.resetProduct();
                    this.resetInput();
                    return;
                }
                if (p.bulkSale == 'no' && typeof this.quantity != 'undefined') {
                    this.subtotal = this.quantity * this.price
                    this.updateCart();
                    this.updateTable();
                    this.updateTotal();
                    this.resetProduct();
                    this.resetInput();
                    return;
                }
                //#endregion 
            }
        } else {
            swal({
                position: 'top-end',
                icon: 'error',
                title: 'Producto invalido',
                showConfirmButton: false,
                timer: 800
            })
            this.resetInput();
        }
    }

    async existProduct() {
        try {
            const answer = await fetch(`${PRODUCTS_API}?code=${this.code}`);
            const data = await answer.json();
            return data;
        } catch (error) {
            return null;
        }
    }
    moreProducts(text) {
        const asterisk = text.indexOf("*");
        const quantity = text.slice(0, asterisk);
        let error = false;
        let code = text.slice(asterisk + 1, text.length);

        if (asterisk != -1) {
            if (quantity.match(/[a-z]/i)) {
                swal({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Cantidad Equivocada',
                        showConfirmButton: false,
                        timer: 800
                    })
                    .then(() => {

                    })
            }
            //validates if it has more than one *
            for (var i = 1; i < code.length; i++) {
                if (code[i] == '*') {
                    error = true;
                }
            }
            if (error) {
                swal({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Demasiados ( * ) en el ingreso de la cantidad',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    .then(() => {
                        this.resetInput()
                    })
            }
            return Array(quantity, code)
        } else
            return undefined
    }
    resetInput() {
        let input = document.getElementById(ID_INPUT_CODE)
        setTimeout(() => {
            input.value = ''
            input.focus();
        }, 10);

    }
    verifyIsInCar() {
        let found = false
        if (typeof this.car !== 'undefined' && this.car !== null && this.car !== '') {
            this.car.forEach(ele => {
                if (ele['code'] == this.code) {
                    found = true
                }
            });
        }
        return found;

    }
    addToCar() {
        this.car.push({
            code: this.code,
            quantity: this.quantity,
            subtotal: this.subtotal
        })

    }
    removeFromCar(code) {
        for (let i = 0; i < this.car.length; i++) {
            if (this.car[i].code == code) {
                if (this.car.length == 1) {
                    this.car = new Array()
                } else {
                    this.car.splice(i, 1);
                }
            }
        }
    }
    addToTable() {
        //creating elements
        let tr = document.createElement('tr')
        let tdCode = document.createElement('td')
        let tdName = document.createElement('td')
        let tdPrice = document.createElement('td')
        let tdQuantity = document.createElement('td')
        let tdSubTotal = document.createElement('td')
        let tdDelete = document.createElement('td')
        let image = document.createElement('img')

        //get body
        let tableBody = document.getElementById(ID_TABLE_BODY);

        //set id's
        tr.id = this.code
        tdCode.id = 'code' + this.code
        tdName.id = 'name' + this.code
        tdPrice.id = 'price' + this.code
        tdQuantity.id = 'quantity' + this.code
        tdSubTotal.id = 'subtotal' + this.code

        // image
        image.src = "images/delete.png"
        image.classList.add("image")
        //append image
        tdDelete.appendChild(image);

        //On click delete row
        //argumento this.code se esta sobre escribiendo entonces hay que encontrar una manera 
        //de que cada uno se pueda eliminar de el carrito 
        image.addEventListener('click', () => {
            tableBody.removeChild(tr);
            let code = tr.id
            this.removeFromCar(code);
            this.updateTotal();
        })
        //on mouse over
        image.addEventListener("mouseover", () => {
            image.src = "images/delete_red.png"
        })
        image.addEventListener("mouseout", () => {
            image.src = "images/delete.png"
        })

        //inner data 
        tdCode.innerHTML = this.code
        tdName.innerHTML = this.name
        tdPrice.innerHTML = this.price
        tdQuantity.innerHTML = this.quantity
        tdSubTotal.innerHTML = this.subtotal
        this.updateTotal();

        //append tds to tr
        tr.appendChild(tdCode)
        tr.appendChild(tdName)
        tr.appendChild(tdPrice)
        tr.appendChild(tdQuantity)
        tr.appendChild(tdSubTotal)
        tr.appendChild(tdDelete)

        //append tr to body
        tableBody.appendChild(tr)

    }
    updateTable() {
        let tdSubTotal = document.getElementById('subtotal' + this.code)
        let tdQuantity = document.getElementById('quantity' + this.code)
        tdQuantity.innerHTML = this.quantity;
        tdSubTotal.innerHTML = this.subtotal;
    }

    getTotal() {
        let total = 0.0;
        this.car.forEach(ele => {
            total = ele.subtotal + total
        })
        this.total = total;
    }
    updateTotal() {
        this.getTotal();
        let labelTotal = document.getElementById(ID_TOTAL_LABEL);
        let labelWindow = document.getElementById(ID_TOTAL_LABEL_WINDOW);
        labelTotal.innerHTML = this.total;
        labelWindow.innerHTML = '$' + this.total;
    }

    setPopUpListener() {
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        let button = document.getElementById('cerrar-popup');
        let input = document.getElementById('popup-input-quantity');
        let infoInput = document.getElementById(ID_INPUT_CODE);

        //asignar para poder cerrar la ventana
        button.addEventListener('click', this.hidQuantityPopUp)

        input.addEventListener('keydown', () => {
            if (event.keyCode == 13) {
                if (typeof input.value !== 'undefined' && input.value != '') {
                    this.quantity = input.value
                    this.subtotal = Math.round(this.quantity * this.price)
                    if (this.verifyIsInCar() == true) {
                        this.updateCart();
                        this.updateTable();
                        this.updateTotal();
                        this.resetProduct();
                    } else {

                        this.addToCar();
                        this.addToTable();
                        this.resetProduct();
                    }
                    this.hidQuantityPopUp()
                    infoInput.value = ''
                    input.value = ''
                } else {
                    //cancelar transaccion porque el valor esta vacio
                    swal({
                            title: 'Cantidad Vacia',
                            text: "La cantidad que se ingreso es 0 ",
                            icon: 'error',
                            color: '#123',
                            button: 'ok',
                            cancel: 'cancelar'
                        })
                        .then(() => {
                            setTimeout(() => input.focus(), 150)
                        })


                }
            } else if (event.keyCode == 27) {
                this.hidQuantityPopUp();

            }
        });


    }
    showQuantityPopUp() {
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        let input = document.getElementById('popup-input-quantity')
        overlay.classList.add('active');
        div.classList.add('active');

        setTimeout(() => {
            input.focus()
        }, 100);

    }
    hidQuantityPopUp() {
        let overlay = document.getElementById('overlay-quantity');
        let div = document.getElementById('div-quantity');
        overlay.classList.remove('active');
        div.classList.remove('active');
        this.resetInput();
    }
    addCancelListener() {
        let btnCancel = document.getElementById("btn-cancel-sell");
        btnCancel.addEventListener("click", () => {
            swal({
                    title: 'Cancelar compra',
                    text: "La compra se cancelara completamente,esta seguro que quiere cancelar ?",
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
                        //cancelar la transaccion
                        swal(
                            'Cancelada!',
                            'Compra Cancelada',
                            'success'
                        )
                        this.cancelTransaction()
                        this.resetInput();
                    } else {
                        //no cancelar la transaccion
                        this.resetInput();
                    }

                })
        })
    }
    cancelTransaction() {
        if (this.car != '' && typeof this.car !== 'undefined') {
            this.car.forEach(ele => {
                let tr = document.getElementById(ele.code)
                let body = document.getElementById(ID_TABLE_BODY)
                body.removeChild(tr);
            });
            this.total = 0
            this.name = ''
            this.price = 0.0
            this.subtotal = 0
            this.car = new Array()
            this.updateTotal()
        }
    }

    addChargeSellListener() {
        let btnAbrirPopup = document.getElementById('abrir-popup'),
            btnCerrarPopup = document.getElementById('btn-cerrar-popup'),
            input = document.getElementById('inputAmount'),
            btnCredit = document.getElementById('btn-to-credit')

        //Add events listeners
        btnAbrirPopup.addEventListener('click', this.openPopUpSell);
        btnCerrarPopup.addEventListener('click', this.closePopUpSell);
        input.addEventListener('keydown', this.checkChange.bind(this));
        btnCredit.addEventListener('click', this.saleToCredit.bind(this))


    }

    openPopUpSell() {
        let overlay = document.getElementById('overlay'),
            popup = document.getElementById('popup'),
            input = document.getElementById('inputAmount');
        // focus input
        setTimeout(() => {
            input.focus()
        }, 100);

        overlay.classList.add('active');
        popup.classList.add('active');

    }
    closePopUpSell() {
        let overlay = document.getElementById('overlay'),
            popup = document.getElementById('popup')
        overlay.classList.remove('active');
        popup.classList.remove('active');
        this.resetInput();
    }
    checkChange() {
        let input = document.getElementById('inputAmount');
        let changeLabel = document.getElementById('change-label')
        let label_change_missing = document.getElementById(ID_LABEL_CHANGE_MISSING);
        if (event.keyCode == '13') {
            if (input.value >= this.total) {
                label_change_missing.textContent = "Cambio :"
                //vamos bien
                changeLabel.innerHTML = (input.value - this.total)
                if (input.value == this.total) {
                    this.finishedSell()
                }

                setTimeout(() => {
                    let btnFinishSale = document.getElementById(BTN_FINISH_SALE)
                    btnFinishSale.addEventListener('click', this.finishedSell.bind(this))
                }, 10);

            } else {
                let missing = this.total - input.value;
                label_change_missing.textContent = "Faltante : ";
                changeLabel.innerHTML = missing;

            }
        }
        if (event.keyCode == 27) {
            this.closePopUpSell();
        }
        if (event.keyCode == 67) {
            this.saleToCredit();
        }


    }
    resetProduct() {
        this.subtotal = undefined;
        this.code = undefined;
        this.quantity = undefined;
        this.client = 1;
    }

    verifyQuantityBulk() {
        if (typeof this.quantity == 'undefined') {
            this.verifyQuantityBulk()
        } else {
            console.clear();
        }
    }
    updateCart() {
        let indexFound = this.indexFound()
        let totalQuantity = parseFloat(this.car[indexFound].quantity) + parseFloat(this.quantity)
        let subtotal = parseFloat(this.car[indexFound].subtotal) + parseFloat(this.subtotal)
        this.car[indexFound].subtotal = subtotal
        this.car[indexFound].quantity = totalQuantity
        this.quantity = totalQuantity;
        this.subtotal = subtotal;
    }
    indexFound() {
        let position = 0
        for (let i = 0; i < this.car.length; i++) {
            if (this.code == this.car[i].code) {
                position = i
            }
        }
        return position;
    }
    finishedSell() {
        //send a request to register sale  
        let x = new XMLHttpRequest();
        x.open('POST', URL_SALES_API, true);
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        //if client is different to 1 which is the default 
        if (typeof this.client !== 'undefined' && this.client != 1) {
            x.send('total=' + this.total + '&client=' + this.client + '&type=credito');
        } else {
            x.send('total=' + this.total);
        }
        x.onreadystatechange = () => {
            if (x.status == 200 && x.readyState == 4) {
                let sell = JSON.parse(x.responseText)
                this.idSale = sell.idSale
                if (typeof this.car !== 'undefined') {
                    this.car.forEach(e => {
                        setTimeout(() => {
                            this.sendAProduct(sell.idSale, e.code, e.quantity, e.subtotal);
                        }, 200);

                    });
                    swal({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Compra exitosa',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    setTimeout(function () {
                        window.location.reload(true)
                    }, 2000)
                } else {
                    console.log('Empty car somehow')
                    swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'El carrito esta vacio !',
                        footer: '<a href>Ingresa algun producto para poder continuar</a>'
                    })
                }
            }
        }
    }
    sendAProduct(saleID, code, quantity, subtotal) {
        if (typeof saleID !== 'undefined' && saleID != '' &&
            typeof code !== 'undefined' && code != '' &&
            typeof quantity !== 'undefined' && quantity != '' &&
            typeof subtotal !== 'undefined' && subtotal != '') {
            //send request with not answer spectated
            var x = new XMLHttpRequest();
            x.open('POST', URL_PROD_SALE_API, true);
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            x.send('idSell=' + saleID + '&codeProduct=' + code + '&quantity=' + quantity + '&subTotal=' + subtotal);
            x.onreadystatechange = function () {
                if (x.status == 200 && x.readyState == 4) {
                    let answer = JSON.parse(x.responseText)
                    if (answer.statusCode == 404) {
                        //if logical error
                        swal({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Error' + answer.message,
                            showConfirmButton: true,
                        })
                    }
                }
            }

        }
    }
    addShortCutListeners() {
        //#region shortcuts array
        let shortCuts = new Array({
            id: 'btnFrutas',
            code: 257554
        }, {
            id: 'btnVerduras',
            code: 257554
        }, {
            id: 'btnLacteos',
            code: 257554
        }, {
            id: 'btnSodas',
            code: 257554
        }, {
            id: 'btnPan',
            code: 257554
        }, {
            id: 'btnCarnes',
            code: 257554
        }, {
            id: 'btnSabritas',
            code: 257554
        }, {
            id: 'btnEnlatados',
            code: 257554
        })
        //#endregion
        shortCuts.forEach(sc => {
            let button = document.getElementById(sc.id)
            button.addEventListener('click', () => {
                this.addProduct(sc.code)
            })
        });
    }
    addProduct(code) {
        this.code = code
        this.verification()
    }
    getClients() {
        setTimeout(() => {
            let x = new XMLHttpRequest();
            x.open('GET', CLIENTS_API)
            x.send()
            x.onreadystatechange = () => {
                let select = document.getElementById('select-client')
                if (x.status == 200 && x.readyState == 4) {
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
        }, 200);
    }
    saleToCredit() {
        this.closePopUpSell();
        this.openPopUpSellCredit();
    }
    openPopUpSellCredit() {
        let overlay = document.getElementById('overlay-popup-credit'),
            popup = document.getElementById('popup-credit'),
            btnCash = document.getElementById('btn-to-cash'),
            btnClose = document.getElementById('cerrar-credit-popup'),
            btnFinishCredit = document.getElementById('btn-finish-sale-credit'),
            labelTotal = document.getElementById('label-total-credit'),
            select = document.getElementById('select-client')

        overlay.classList.add('active');
        popup.classList.add('active');
        //input total
        if (typeof this.total !== 'undefined') {
            labelTotal.innerHTML = '$' + this.total
        } else {
            labelTotal.innerHTML = '$0.0'
        }
        btnClose.addEventListener('click', () => {
            this.closePopUpCredit()
        })
        btnCash.addEventListener('click', () => {
            this.closePopUpCredit()
            this.openPopUpSell()
            this.client = 1;
        })

        btnFinishCredit.addEventListener('click', () => {
            let select = document.getElementById('select-client')
            let index = select.selectedIndex
            //verify its amount of credit
            let moneyfree = parseFloat(select[index].dataset.limit) - parseFloat(select[index].dataset.used)
            if (moneyfree >= this.total) {
                //finish transaction
                //we got client
                this.client = parseInt(select[index].value)
                this.finishedSell()
                this.finishedSellCredit();
            } else {
                // show error
                swal({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Saldo insuficiente',
                    text: 'Saldo del cliente:' + moneyfree,
                    showConfirmButton: false,
                    timer: 2000
                })
            }

        })

        select.addEventListener('keypress', () => {
            console.log("selec keycode : " + event.keyCode)
            let select = document.getElementById('select-client')
            let index = select.selectedIndex
            this.client = parseInt(select[index].value)
            if (event.keyCode == 13) {

                //verify its amount of credit
                let moneyfree = parseFloat(select[index].dataset.limit) - parseFloat(select[index].dataset.used)
                if (moneyfree >= this.total) {
                    //finish transaction
                    //we got client

                    this.finishedSell()
                    this.finishedSellCredit();

                } else {
                    // show error
                    this.closePopUpCredit();
                    setTimeout(() => {
                        swal({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Saldo insuficiente',
                            text: 'Saldo del cliente:' + moneyfree,
                            timer: 2000
                        })
                        this.resetInput()
                    }, 300);
                }
            }
        })

        setTimeout(() => {
            select.focus()
        }, 200);

    }
    closePopUpCredit() {
        let overlay = document.getElementById('overlay-popup-credit'),
            popup = document.getElementById('popup-credit')
        overlay.classList.remove('active');
        popup.classList.remove('active');
    }
    finishedSellCredit() {
        setTimeout(() => {
            let a = new XMLHttpRequest();
            a.open('POST', URL_SALE_CREDIT_API, true);
            a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            a.send('action=post' + '&client=' + this.client + '&total=' + this.total + '&sale=' + this.idSale)
            a.onreadystatechange = () => {
                if (a.status == 200 && a.readyState == 4) {
                    let answer = JSON.parse(a.responseText);
                }
            }
        }, 200);

    }
}

function init() {
    product = new Product();
}