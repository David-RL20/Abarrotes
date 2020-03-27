class Client{
    constructor(client){
        this.id = client.number
        this.name = client.name
        this.limit = client.limit
        this.moneyUsed = client.total_used
        this.updateMoneyFree() 
    } 
    update(){
        let inputName  = document.getElementById('inName'+this.id)
        let selectLimit  = document.getElementById('select'+this.id)
        let index = selectLimit.selectedIndex 
        let x= new XMLHttpRequest();
        x.open('POST','http://192.168.100.195/Abarrotes/api/AllClients.php')
        x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        x.send('action=update'+'&number='+this.id+'&name='+inputName.value+'&limit='+selectLimit[index].value)
        x.onreadystatechange = function(){
            if(x.status == 200 && x.readyState == 4){
                if(x.responseText != '1'){
                    swal({
                        position: 'top-end',
                        icon: 'error',
                        title: x.responseText,
                        showConfirmButton: false
                      })
                }else{
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
    delete(){
        let x= new XMLHttpRequest();
        x.open('POST','http://192.168.100.195/Abarrotes/api/AllClients.php')
        x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        x.send('action=delete'+'&number='+this.id)
        x.onreadystatechange = function(){
            if(x.status == 200 && x.readyState == 4){
                if(x.responseText != '1'){
                    swal({
                        position: 'top-end',
                        icon: 'error',
                        title: x.responseText,
                        showConfirmButton: false
                      })
                    setTimeout(() => {
                        window.location.reload()
                      }, 1000);
                }else{
                    swal({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Cliente eliminado',
                        showConfirmButton: false, 
                      }) 
                }
            }
        }
    }
    updateMoneyFree(){
        this.moneyFree = this.limit - this.moneyUsed
    }

}

function init(){
    getClients()
    addSearchListener();
}
function getClients(){
    x= new XMLHttpRequest();
    x.open('GET','http://192.168.100.195/Abarrotes/api/AllClients.php')
    x.send()
    x.onreadystatechange = function(){
        if(x.status == 200 && x.readyState == 4){
            let clients = JSON.parse(x.responseText)
            clients.forEach(client => {  
                if(client.number != 1){
                    addClientToTable(client) 
                }
            });
            let loader = document.getElementById('loader')
            loader.classList.remove('loader')
        }
        
    }
}

function addClientToTable(_client){
    let client = new Client(_client)
    let tableBody = document.getElementById('tableBody')
    let tr = document.createElement('tr')
    //td
    let tdID = document.createElement('td')
    let tdName = document.createElement('td')
    let tdLimit = document.createElement('td')
    let tdLimitUsed = document.createElement('td')
    let tdLimitFree = document.createElement('td')
    let tdAction = document.createElement('td')
    //btns
    let btnEdit = document.createElement('button')
    let btnDelete = document.createElement('button')
    //images
    let imgEdit = document.createElement('img')
    let imgDelete = document.createElement('img')
    //ids
    tdName.id = 'name'+client.id
    tdLimit.id = 'limit'+client.id 
    imgDelete.id='delete'+client.id
    imgEdit.id='edit'+client.id

    //img src
    imgDelete.src='images/delete_red.png'
    imgEdit.src='images/edit_blue.png'
    //on mouse over
    btnEdit.addEventListener('mouseover',()=>{ imgEdit.src='images/edit_white.png'})
    btnDelete.addEventListener('mouseover',()=>{ imgDelete.src='images/delete_white.png'})

    //on mouse out
    btnEdit.addEventListener('mouseout',()=>{ imgEdit.src='images/edit_blue.png'})
    btnDelete.addEventListener('mouseout',()=>{ imgDelete.src='images/delete_red.png'})
    //btn classes
    btnEdit.classList.add('btn-outline-primary')
    btnDelete.classList.add('btn-outline-danger')
    btnEdit.classList.add('btn')
    btnDelete.classList.add('btn') 
    let editing = false;
    btnEdit.addEventListener('click',()=>{
        if(!editing){
            let inputName = document.createElement('input')
            let selectLimit = document.createElement('select') 
            //ids
            inputName.id = 'inName'+client.id
            selectLimit.id = 'select'+client.id
            //inner data
            inputName.value = tdName.textContent
            //#region options for select 
            let options = new Array({value:50.00,textContent:'$50'},{value:100.00,textContent:'$100'},{value:200.00,textContent:'$200'},{value:300.00,textContent:'$300'},{value:400.00,textContent:'$400'},{value:500.00 ,textContent:'$500'},{value:600.00,textContent:'$600'},{value:700.00,textContent:'$700'},{value:800.00,textContent:'$800'},{value:900.00,textContent:'$900'},{value:1000.00,textContent:'$1000'})
            for (let i = 0; i < options.length; i++) { 
                let op = document.createElement('option')
                op.value = options[i].value
                op.innerHTML = options[i].textContent 
                console.log('valor en la opcion'+options[i].value)
                console.log('limite del cliente'+client.limit)
                selectLimit.appendChild(op)
                if(client.limit == options[i].value){
                    selectLimit.selectedIndex = i; 
                } 
            } 

            //#endregion 

            //put 'em in blank

            tdLimit.innerHTML=''
            tdName.innerHTML=''

            //append
            tdName.appendChild(inputName)
            tdLimit.appendChild(selectLimit)

        }else{
            client.update()
        }

        editing= !editing;
    })

    btnDelete.addEventListener('click',()=>{client.delete(); tableBody.removeChild(tr)})

    //inner data
    tdID.innerHTML=client.id
    tdName.innerHTML=client.name
    tdLimit.innerHTML= '$ '+client.limit
    tdLimitUsed.innerHTML= '$ ' +client.moneyUsed
    tdLimitFree.innerHTML='$ '+client.moneyFree
    


    //append 
    btnEdit.appendChild(imgEdit)
    btnDelete.appendChild(imgDelete)
    tdAction.appendChild(btnEdit)
    tdAction.appendChild(btnDelete)
    tr.appendChild(tdID)
    tr.appendChild(tdName)
    tr.appendChild(tdLimit)
    tr.appendChild(tdLimitUsed)
    tr.appendChild(tdLimitFree)
    tr.appendChild(tdAction)
    tableBody.appendChild(tr)


}

function addSearchListener(){
    let input = document.getElementById('inputSearch'),
    btnSearch = document.getElementById('btn-search')

    input.addEventListener('keypress', search)
    btnSearch.addEventListener('click',search)
}
function search(){ 
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

function add(){
    let input = document.getElementById('name')
    let select = document.getElementById('selectLimit')  
    if(input.value != '' && select[select.selectedIndex].value != 0){
        let x= new XMLHttpRequest();
        x.open('POST','http://192.168.100.195/Abarrotes/api/AllClients.php',true)
        x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        x.send('action=post'+'&name='+input.value+'&limit='+select[select.selectedIndex].value) 
        x.onreadystatechange = function(){
            if(x.status == 200 && x.readyState == 4){ 
                if(x.responseText != '1'){
                    swal({
                        position: 'top-end',
                        icon: 'error',
                        title: x.responseText,
                        showConfirmButton: false
                      })
                }else{
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
                
            }
            
        }
    }else{
        swal({
            position: 'top-end',
            icon: 'error',
            title: 'Limite y nombre deben ser asignados',
            showConfirmButton: false
          })
    }
}