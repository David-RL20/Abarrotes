const month = 'month';
const day = 'day';
const year = 'year';
const week = 'week';
const months = ['enero', 'febrero', 'marzo ', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const days = ['Lunes', 'Martes', 'Miercoles ', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const STATS_API = 'http://localhost/Abarrotes/api/test.php?';

Number.prototype.round = function (places) {
  return +(Math.round(this + "e+" + places) + "e-" + places);
}

function init() {
  //show date
  showDate()
  //Cash sales
  showCashTotalSales()
  //Credit sales
  showTotalCreditSales()
  //General sales
  showTotalDailySales()
  //Stats
  showDailySales()
  showWeeklySales()
  showMonthlySales()
  showYearlySales()
}
//Shows the date on the right corner of the page
async function showDate() {
  const date = new Date();
  const day = days[date.getDay() - 1]
  const label_date = document.querySelector(`#label-title`)
  const _date = await getToday();
  label_date.insertAdjacentHTML('beforeend', `
      <div class="col-3">
        <div style="border:none;height:70px" class="img-left-container"> <img width="50px" src="images/watch.png">
        </div>
        <div>
          <h5 class="col-12">Fecha :</5> 
          <p style="font-size:12pt;font-weight:400;">${day} , ${_date}</p>
        </div>
      </div>
  `);
}
//shows total daily cash sales
async function showCashTotalSales() {
  const _total = await getTotalDailySales();
  const all_sales = document.querySelector(`#cash-sales-container`)
  const profits = (_total.total * .30);
  const investment = (_total.total * .70)
  all_sales.insertAdjacentHTML('beforeend',
    ` <div style="display: flex;justify-content: space-evenly;"> 
          <div class="col-3"">
            <div style=" background-color: #FFB74D;" class=" img-left-container"> 
                <img width="50px" src="images/money.png" alt=""> 
              </div>
            <div>
              <p class="col-12"><strong>Ventas del dia :</strong></p> 
              <label class="col-12 text-center money-label">$${new Intl.NumberFormat('es-MX').format(_total.total)}</label>
            </div>
          </div>

        <div class="col-3">
          <div style="background-color: #FFF8E1;" class="img-left-container"> 
            <img width="50px" src="images/percentage.png" alt=""> 
          </div>
          <div>
            <p class="col-12"><strong>Ganancias :</strong></p>
            <label class="col-12 money-label">$${new Intl.NumberFormat('es-MX').format(profits.round(2))}</label>
          </div>
        </div>
        <div class="col-3">
          <div style="background-color: #0277BD;" class="img-left-container"> 
            <img width="50px" src="images/investment.png" alt=""> 
          </div>
          <div>
            <p class="col-12"><strong>Inversión: </strong></p>
            <label class="col-12 money-label">$${new Intl.NumberFormat('es-MX').format(investment.round(2))}</label>
          </div>
        </div>
      </div>`);
}
//shows total daily credit sales
async function showTotalCreditSales() {
  const _total = await getTotalDailySales();
  const all_sales = document.querySelector(`#credit-sales-container`)
  const profits = (_total.total * .30);
  const investment = (_total.total * .70)

  all_sales.insertAdjacentHTML('beforeend',
    ` <div style="display: flex;justify-content: space-evenly;"> 
          <div class="col-3"">
            <div style=" background-color: #FFB74D;" class=" img-left-container"> 
                <img width="50px" src="images/money.png" alt=""> 
              </div>
            <div>
              <p class="col-12"><strong>Ventas del dia :</strong></p> 
              <label class="col-12 text-center money-label">$${new Intl.NumberFormat('es-MX').format(_total.total)}</label>
            </div>
          </div>

        <div class="col-3">
          <div style="background-color: #FFF8E1;" class="img-left-container"> 
            <img width="50px" src="images/percentage.png" alt=""> 
          </div>
          <div>
            <p class="col-12"><strong>Ganancias :</strong></p>
            <label class="col-12 money-label">$${new Intl.NumberFormat('es-MX').format(profits.round(2))}</label>
          </div>
        </div>
        <div class="col-3">
          <div style="background-color: #0277BD;" class="img-left-container"> 
            <img width="50px" src="images/investment.png" alt=""> 
          </div>
          <div>
            <p class="col-12"><strong>Inversión: </strong></p>
            <label class="col-12 money-label">$${new Intl.NumberFormat('es-MX').format(investment.round(2))}</label>
          </div>
        </div>
      </div>`);
}
//shows total daily sales
async function showTotalDailySales() {
  const _total = await getTotalDailySales();
  const all_sales = document.querySelector(`#all-sales-container`)
  const profits = (_total.total * .30);
  const investment = (_total.total * .70)

  all_sales.insertAdjacentHTML('beforeend',
    ` <div style="display: flex;justify-content: space-evenly;"> 
          <div class="col-3"">
            <div style=" background-color: #FFB74D;" class=" img-left-container"> 
                <img width="50px" src="images/money.png" alt=""> 
              </div>
            <div>
              <p class="col-12"><strong>Ventas del dia :</strong></p> 
              <label class="col-12 text-center money-label">$${new Intl.NumberFormat('es-MX').format(_total.total)}</label>
            </div>
          </div>

        <div class="col-3">
          <div style="background-color: #FFF8E1;" class="img-left-container"> 
            <img width="50px" src="images/percentage.png" alt=""> 
          </div>
          <div>
            <p class="col-12"><strong>Ganancias :</strong></p>
            <label class="col-12 money-label">$${new Intl.NumberFormat('es-MX').format(profits.round(2))}</label>
          </div>
        </div>
        <div class="col-3">
          <div style="background-color: #0277BD;" class="img-left-container"> 
            <img width="50px" src="images/investment.png" alt=""> 
          </div>
          <div>
            <p class="col-12"><strong>Inversión: </strong></p>
            <label class="col-12 money-label">$${new Intl.NumberFormat('es-MX').format(investment.round(2))}</label>
          </div>
        </div>
      </div>`);
}

//get total general sales
async function getTotalDailySales() {
  const today = await getToday();
  const request = await fetch(`${STATS_API}lapse=day&date=${today}`);
  const answer = await request.json()
  return answer;
}

function getToday() {
  return new Promise((resolve, reject) => {
    const _today = new Date();
    const getDay = () => {
      let _day;
      (_today.getDate() > 9) ? _day = `${_today.getDate()}`: _day = `0${_today.getDate()}`
      return _day
    }
    const getMonth = () => {
      let _month;
      ((_today.getMonth() + 1) > 9) ? _month = `${_today.getMonth() + 1}`: _month = `0${_today.getMonth() + 1}`
      return _month
    }
    const getYear = () => {
      return _today.getFullYear();
    }

    resolve(`${getYear()}-${getMonth()}-${getDay()}`);
  });
}

async function showMonthlySales() {
  const data = [{
    name: 'Tokyo',
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

  }, {
    name: 'New York',
    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

  }, {
    name: 'London',
    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

  }, {
    name: 'Berlin',
    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

  }];


  Highcharts.chart(month, {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Ventas mensuales'
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: "Dinero"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: data
  });

  setTimeout(() => {
    document.getElementsByClassName("highcharts-exporting-group")[0].setAttribute("display", "none")
    document.getElementsByClassName("highcharts-credits")[0].setAttribute("display", "none")
  }, 0);

}
async function showDailySales() {

}
async function showWeeklySales() {

}
async function showYearlySales() {

}