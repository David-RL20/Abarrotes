const ID_INPUT_CODE = 'inputCodeProduct'
const ID_DATALIST = 'dataListProducts'
const ID_TABLE_BODY = "tableBody";
const ID_TOTAL_LABEL = "totalCurrently";
const ID_TOTAL_LABEL_WINDOW = "label-total-window";
const BTN_FINISH_SALE = 'btn-finish-sale'
const ID_LABEL_CHANGE_MISSING = 'lab-change-missing';
const ID_TABLEBODY_SEARCH_PRODUCT = 'tb-search-product';
const ID_IN_CODE_SEARCHPRODUCT = 'in-search-product';
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
        this.addSearchProductListener()
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
        input.addEventListener("keydown", () => {
            //Enter 
            if (event.keyCode === 13) {
                //insert product
                if (input.value != '') {
                    const moreProducts = this.moreProducts(input.value);
                    if (typeof moreProducts !== 'undefined') {
                        //get the values of code an quantity if * on input
                        this.quantity = moreProducts[0]
                        this.code = moreProducts[1]
                        this.verification();
                    } else {
                        this.code = input.value
                        this.verification()
                    }
                } else {
                    this.openPopUpSell();
                }
            }
            //F2 SEARCH PRODUCT
            if (event.keyCode === 113) {
                //search
                console.log('searching...')
                document.querySelector(`#${ID_IN_CODE_SEARCHPRODUCT}`).focus();

            }
            if (event.keyCode === 115) {
                window.open("sell.html", '_blank');
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
        //GET TABLE BODY
        const TB = document.getElementById(ID_TABLE_BODY);

        TB.insertAdjacentHTML('afterbegin',
            `<tr id='tr${this.code}'>
                <td>${this.code}</td>
                <td>${this.name}</td>
                <td id='price${this.code}'> ${this.price} </td>
                <td id='quantity${this.code}' > ${this.quantity}</td>
                <td id='subtotal${this.code}' >${this.subtotal}</td>
                <td><img id='delete${this.code}' class='image' src='images/delete.png'></img></td>
            </tr>`)
        //GET ROW AND IMG DELETE
        const IMG_DEL = document.querySelector(`#delete${this.code}`)
        const TR = document.querySelector(`#tr${this.code}`)
        //ON CLICK DELETE ROW AND REMOVE FROM CAR
        IMG_DEL.addEventListener('click', () => {
            TB.removeChild(TR);
            this.removeFromCar(TR.id);
            this.updateTotal();
        })
        //CHANGE IMG TO RED 
        IMG_DEL.addEventListener("mouseover", () => {
            IMG_DEL.src = "images/delete_red.png"
        })
        //CHANGE IMG TO NORMAL
        IMG_DEL.addEventListener("mouseout", () => {
            IMG_DEL.src = "images/delete.png"
        })

        this.updateTotal();

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
                        this.resetTransaction()
                        this.resetInput();
                    } else {
                        //no cancelar la transaccion
                        this.resetInput();
                    }

                })
        })
    }
    resetTransaction() {
        if (this.car != '' && typeof this.car !== 'undefined') {
            this.car.forEach(ele => {
                let tr = document.getElementById("tr"+ele.code)
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
        this.resetWindowSell();
        this.resetInput();
    }
    resetWindowSell() {
        let input = document.querySelector('#inputAmount');
        let change_label = document.querySelector('#change-label');
        input.value = '';
        change_label.textContent = '';
    }
    checkChange() {
        let input = document.getElementById('inputAmount');
        let changeLabel = document.getElementById('change-label')
        let label_change_missing = document.getElementById(ID_LABEL_CHANGE_MISSING);
        let btnFinishSale = document.getElementById(BTN_FINISH_SALE)
        if (event.keyCode == '13') {
            if (input.value >= this.total) {
                label_change_missing.textContent = "Cambio :"
                //vamos bien
                changeLabel.innerHTML = (input.value - this.total)
                if (input.value == this.total) {
                    this.finishedSell()
                }

                setTimeout(() => {
                    btnFinishSale.addEventListener('click', this.finishedSell.bind(this))
                    btnFinishSale.focus();
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
        btnFinishSale.addEventListener('keydown', () => {
            if (event.keyCode === 27) {
                this.closePopUpSell();
            }
        })


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
    async finishedSell() {
        try {
            //send all car to be processed in the backend
            const request = await fetch(URL_SALES_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `total=${this.total}&products=${JSON.stringify(this.car)}&client=${this.client}`
            });

            const response = await request.json();
            if (response.status == 200) {
                swal({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Compra exitosa',
                    showConfirmButton: false,
                    timer: 2000
                })
                this.idSale = response.sale
                //reset if successfully sale
                this.resetTransaction();
                this.closePopUpSell();
            } else {
                swal({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.message,
                    footer: '<a href>Ingresa algun producto para poder continuar</a>'
                })
            }

        } catch (err) {
            console.log(err)
        }
    }
    addProduct(code) {
        this.code = code
        this.verification()
    }
    getClients() {
        setTimeout(async () => {
            let answer = await fetch(CLIENTS_API);
            let json = await answer.json()
            let select = document.getElementById('select-client')
            json.forEach(client => {
                select.insertAdjacentHTML('afterbegin', `<option value=${client.number} data-limit=${client.limit} data-used=${client.total_used} >
                    ${client.name}</option>`)
            });
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
    addSearchProductListener() {
        //Variables
        let in_search = document.querySelector(`#${ID_IN_CODE_SEARCHPRODUCT}`);
        in_search.addEventListener('keydown', async () => {
            if (event.keyCode === 13) {
                this.code = in_search.value
                let product = await this.existProduct();
                if (product) {
                    //insert info into mini table
                    this.addProductToTableSearch(product)
                    //reset input
                    in_search.value = ``;
                    //reset code
                    this.code = null
                }
            }
            if (event.keyCode === 113) {
                document.querySelector(`#${ID_INPUT_CODE}`).focus();
            }
        });
    }
    addProductToTableSearch(product) {
        //variables
        let tb_search = document.querySelector(`#${ID_TABLEBODY_SEARCH_PRODUCT}`);
        tb_search.innerHTML = `<tr> 
            <th>${product.code}</th>
            <th>${product.name}</th>
            <th>${product.price}</th>
        </tr>`;
    }
}

function init() {
    product = new Product();

}
