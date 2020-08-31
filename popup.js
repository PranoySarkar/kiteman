let watchList = [];
let totalInvested = null;
let totalProfit = null;
let totalAvailableFund = null;
let lastSnapShotUpdate = null;

let communicationSuccess = false;


function init() {
  openKiteIfNotOpen();
  setTimeout(_ => {
    sendMessage({ task: 'LATEST_UPDATE' })
  }, 3000)

  setTimeout(_ => {
    if (!communicationSuccess) {
      document.querySelector('#reopenKiteRow').style.visibility = 'unset';
    }
  }, 6500)

  sendMessage({ task: 'LATEST_UPDATE' })

  initializeListeners();
  getAnalyticsAndUpdateTable();
}

function openCleanKiteTab() {

  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, tabs => {
      let index = tabs.findIndex((tab) => { return tab.url.includes('https://kite') });
      if (index != -1) {
        chrome.tabs.remove(tabs[index].id, function () {
          return setTimeout(_ => {
            return openKiteIfNotOpen()
              .then(resolve)

          }, 200)

        });
      } else {
        return openKiteIfNotOpen()
          .then(resolve)
      }

    });
  })


}

function initializeListeners() {
  document.querySelectorAll('.tabHeaderButton').forEach(btn => {
    btn.addEventListener('click', changeTab)
  })

  let openKiteBtn = document.querySelector('#openKiteBtn');
  openKiteBtn.addEventListener('click', () => {
    highlightKiteTab(true);
  })

  let sortBtnLooser = document.querySelector('#sortBtnLooser');
  sortBtnLooser.addEventListener('click', () => {
    sortInstruments('LOOSER')
  })

  let sortBtnGainer = document.querySelector('#sortBtnGainer');
  sortBtnGainer.addEventListener('click', () => {
    sortInstruments('GAINER')
  });


  let tableFiler = document.querySelector('#tableFiler');
  tableFiler.addEventListener('change', (evt) => {
    updateWatchListTable(evt.target.value);
  })

  let analyticsTableFiler = document.querySelector('#analyticsTableFiler');
  analyticsTableFiler.addEventListener('change', (evt) => {
    getAnalyticsAndUpdateTable(evt.target.value);
  })

  let closeAndReopenKiteBTn = document.querySelector('#closeAndReopenKiteBTn');
  closeAndReopenKiteBTn.addEventListener('click', () => {
    openCleanKiteTab().then(_ => {
      init();
    })
  });

}

function changeTab(event) {

  let btn = event.target;
  if (btn.dataset.body) {
    document.querySelectorAll('.tabHeaderButton').forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tabBody').forEach(tab => tab.style.display = 'none')
    document.querySelector(`#${event.target.dataset.body}`).style.display = 'block'
  }

  if(btn.dataset.listener){
    window[btn.dataset.listener].call();
  }

}

function generateNews(){
  News.updateView();
}

function openKiteIfNotOpen() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, tabs => {
      let found = tabs.some((tab) => { return tab.url.includes('https://kite') });

      if (!found) {
        chrome.tabs.create({ url: 'https://kite.zerodha.com/', selected: false }, _ => {
          setTimeout(_ => {
            resolve();
          }, 500)

        });
      } else {
        resolve()
      }
    });
  })

}



function highlightKiteTab(force = false) {
  chrome.tabs.query({}, tabs => {

    let found = tabs.filter((tab) => {
      let url = tab.url || tab.pendingUrl || '';
      return (url.includes('https://kite') || url.includes('https://kite'))

    });
    if (found.length > 0 && (!found[0].active || force)) {
      chrome.tabs.get(found[0].id, function (tab) {
        chrome.tabs.highlight({ 'tabs': tab.index }, function () { });
      });
    }

  })
}

function sortInstruments(by) {
  sendMessage({ task: 'SORT_INSTRUMENTS', by })
  highlightKiteTab(true);
}

function displayLog(log) {
  sendMessage({ task: 'DISPLAY_LOG', log })
}

chrome.runtime.onMessage.addListener(msg => {
  taskDispatcher(msg)
  communicationSuccess = true;
});

function taskDispatcher(msg) {
  switch (msg.task) {
    case 'WATCH_LIST_UPDATE':
      watchList = msg.watchList;
      updateDbForAnalytics()
      updateWatchListTable();
      break;

    case 'USER_NOT_LOGGED_IN':
      highlightKiteTab();
      break;

    case 'FUND_UPDATE':
      let profitParent = document.querySelector('#profitParent');
      if (msg.data.profit > 0) {
        profitParent.classList.remove('warn');
        profitParent.classList.add('good');
      } else {
        profitParent.classList.remove('good');
        profitParent.classList.add('warn');
      }
      profitParent.querySelector('#profit').innerHTML = `${Math.abs(msg.data.profit)}`;
      let profitLabel = msg.data.profit < 0 ? 'loss' : 'profit';
      totalProfit = msg.data.profit;
      let per = Math.floor(((((Math.abs(totalProfit)) / msg.data.invested) * 10000))) / 100;

      profitParent.querySelector('#profitLabel').innerHTML = `${profitLabel} <span >${per}%</span>`;

      totalInvested = Math.floor((msg.data.invested) * 100) / 100;
      document.querySelector('#invested').innerHTML = `${totalInvested}`;
      document.querySelector('#investedLabel').innerHTML = `invested`;
      updateInvestments(msg.data.positions, msg.data.holdings)

      let tempx = totalAvailableFund + totalProfit + totalInvested
      document.querySelector('#totalAsset').innerHTML = `${Math.floor(tempx * 100) / 100}`;
      document.querySelector('#totalAssetLabel').innerHTML = `Available + Invested + Profit `;

      break;


    case 'CASH_UPDATE':
      totalAvailableFund = Math.floor((msg.data.net) * 100) / 100

      document.querySelector('#available').innerHTML = `${totalAvailableFund}`;
      document.querySelector('#availableLabel').innerHTML = `available`;


      let temp = totalAvailableFund + totalProfit + totalInvested
      document.querySelector('#totalAsset').innerHTML = `${Math.floor(temp * 100) / 100}`;
      document.querySelector('#totalAssetLabel').innerHTML = `Available + Invested + Profit `;
      break;
  }
}

function updateInvestments(positions, holdings) {
  let investmentsTbody = document.querySelector('#investmentsTbody')
  investmentsTbody.innerHTML = '';

  let allInvestments = [...positions, ...holdings]
  let allInvestment = 0;
  let allProfit = 0;
  for (let i = 0; i < allInvestments.length; i++) {
    let eachInvestment = allInvestments[i];

    let row = document.createElement('tr');


    let td2 = document.createElement('td');
    td2.innerHTML = `<a class="deepLInk"  target="_blank" href="https://kite.zerodha.com/chart/web/ciq/${eachInvestment.exchange}/${eachInvestment.name}/${eachInvestment.instrumentToken}" >
    ${eachInvestment.name}</a>`
    row.appendChild(td2);



    let td3 = document.createElement('td');
    td3.innerHTML = eachInvestment.quantity
    row.appendChild(td3);

    let td8 = document.createElement('td');
    td8.innerHTML = `${Math.floor((eachInvestment.buyPrice) * 100) / 100}`
    row.appendChild(td8);

    let td9 = document.createElement('td');
    td9.innerHTML = `${Math.floor((eachInvestment.currentPrice) * 100) / 100}`
    row.appendChild(td9);

    let totalInvested = eachInvestment.quantity * eachInvestment.buyPrice
    allInvestment += totalInvested;
    let td4 = document.createElement('td');
    td4.classList.add('highlight')
    td4.innerHTML = `${Math.floor((totalInvested) * 100) / 100}`
    row.appendChild(td4);

    let totalCurrentValue = eachInvestment.quantity * eachInvestment.currentPrice
    let profit = totalCurrentValue - totalInvested;
    allProfit += profit;

    let td5 = document.createElement('td');
    td5.classList.add('highlight')
    td5.innerHTML = `${Math.floor((profit) * 100) / 100}`
    row.appendChild(td5);


    let perc = (((profit) / totalInvested) * 100);

    if (perc < 0) {
      row.classList.add('warn')
    } else {
      row.classList.add('good')
    }

    let td6 = document.createElement('td');
    td6.classList.add('highlight')
    td6.innerHTML = `${Math.floor((perc) * 100) / 100} %`
    row.appendChild(td6);

    let research = document.createElement('td');
    let instrumentName = encodeURIComponent(eachInvestment.name);
    research.innerHTML = generateLinks(instrumentName)
    row.appendChild(research);

    investmentsTbody.appendChild(row)
  }
  let finalRow = document.createElement('tr');
  finalRow.classList.add('finalRow');



  let totalTd = document.createElement('td');
  totalTd.innerHTML = 'Total';
  totalTd.setAttribute('colspan', '4')
  finalRow.appendChild(totalTd)

  let allInvestmentTd = document.createElement('td');
  allInvestmentTd.innerHTML = Math.floor(allInvestment * 100) / 100;;
  finalRow.appendChild(allInvestmentTd)

  let allProfitTd = document.createElement('td');
  allProfitTd.innerHTML = Math.floor(allProfit * 100) / 100;
  finalRow.appendChild(allProfitTd)

  if (allProfit < 0) {
    finalRow.classList.add('warn')
  } else {
    finalRow.classList.add('good')
  }

  let totalPerc = document.createElement('td');
  totalPerc.classList.add('highlight')
  totalPerc.setAttribute('colspan', '2')
  totalPerc.innerHTML = `${Math.floor((allProfit / allInvestment) * 100 * 100) / 100} %`;
  finalRow.appendChild(totalPerc)

  investmentsTbody.appendChild(finalRow)
}


function generateLinks(instrumentName) {
  let links = `
  <div class="researchLinksTd">
    <button class="researchLinkBtn">Links</button>
    <div class="popup">
      <a class="link" target="_blank" href="https://ticker.finology.in/company/${instrumentName}">Ticker</a>
      <a class="link" target="_blank" href="http://www.google.com/search?q=${instrumentName} news">Google Search</a>
      <a class="link" target="_blank" href="http://www.google.com/finance?q=${instrumentName}">Google Finance</a>
      <a class="link" target="_blank" href="http://www.google.com/search?q=site:https://www.moneycontrol.com/ ${instrumentName}"> Money Control </a>
      <a class="link" target="_blank" href="http://www.google.com/search?q=site:https://economictimes.indiatimes.com/ ${instrumentName}"> The Economic Times</a>
      <a class="link" target="_blank" href="http://www.google.com/search?q=${instrumentName} company">Company Info</a> 
      <a class="link" target="_blank" href="http://www.google.com/search?q=site:https://www.bseindia.com/ ${instrumentName}">BSE India</a>
    </div>
  </div>
  `
  return links.trim();
}
function updateDbForAnalytics() {
  let currentTime = new Date().getTime()
  let currentHour = new Date().getHours();
  let currentDay = new Date().toString().match(/^\w+/)[0].trim().toLowerCase()
  if (currentHour >= 10 && currentHour <= 14 && currentDay != 'sat' && currentDay != 'sun') {
    // do not take  reading before 10  and after 3 (huge fluctuation in market)
    Analytics.getLastUpdated()
      .then(async lastUpdated => {
        // each reading should be 45 apart
        if ((lastUpdated + 45 * 60 * 1000) < currentTime) {
          for (let i = 0; i < watchList.length; i++) {
            let eachInstrument = watchList[i];
           await  Analytics.saveInstrumentSnapshot(eachInstrument)
          }
          if(watchList.length>0){
            Analytics.cleanUp(watchList)
          }
          Analytics.do();
        }
      })
  } else {
    console.log('Not taking reading, unstable market or saturday or sunday')
  }
}
function updateWatchListTable(condition = 'ALL') {

  let watchListTbody = document.querySelector('#watchListTbody')
  watchListTbody.innerHTML = '';

  let tempWatchList = [];
  switch (condition) {
    case 'ALL':
      tempWatchList = [...watchList];
      break;
    case 'TOP2GAINERS&LOSERS':
      tempWatchList = [watchList[0], watchList[watchList.length - 1]];
      break;
    case 'TOP5GAINERS':
    case 'GAINERS':

      tempWatchList = watchList.filter(each => {
        if (each.displacement < 0) {
          return false;
        }
        else {
          return true;
        }
      })
      if (condition == 'TOP5GAINERS') {
        tempWatchList = tempWatchList.splice(0, 5);
      }

      break;
    case 'TOP5LOSERS':
    case 'LOSERS':
      tempWatchList = watchList.filter(each => {
        if (each.displacement >= 0) {
          return false;
        }
        else {
          return true;
        }
      })
      tempWatchList = tempWatchList.reverse();
      if (condition == 'TOP5LOSERS') {
        tempWatchList = tempWatchList.splice(0, 5);
      }

      break;
    default:
      tempWatchList = [...watchList];
      break;
  }

  for (let i = 0; i < tempWatchList.length; i++) {
    let eachInstrument = tempWatchList[i];

    let row = document.createElement('tr');
    if (eachInstrument.displacement < 0) {
      row.classList.add('warn')
    } else {
      row.classList.add('good')
    }

    let td3 = document.createElement('td');
    td3.innerHTML = `<a class="deepLInk"  target="_blank" 
    href="https://kite.zerodha.com/chart/web/ciq/${eachInstrument.exchange}/${eachInstrument.name}/${eachInstrument.instrumentToken}" >
    ${eachInstrument.name}</a>`
    row.appendChild(td3);

    let td2 = document.createElement('td');
    td2.classList.add('highlight');
    td2.innerHTML = eachInstrument.displacement + ' %'
    row.appendChild(td2);


    let td = document.createElement('td');
    let instrumentName = encodeURIComponent(eachInstrument.name);
    td.innerHTML = generateLinks(instrumentName)
    row.appendChild(td);

    watchListTbody.appendChild(row)
  }
}

function getAnalyticsAndUpdateTable(filter = 'all') {

  Analytics.do().then(allInstruments => {
    let analyticsTableBody = document.querySelector('#analyticsTableBody')
    analyticsTableBody.innerHTML = '';

    if(allInstruments.length==0){
      
      let row = document.createElement('tr');
      let dataNotPresent = document.createElement('td');
      dataNotPresent.setAttribute('colspan',5);
      dataNotPresent.innerHTML = `Data not present`
      row.appendChild(dataNotPresent);
      analyticsTableBody.append(row)
      return;
    }

    switch (filter) {
      case 'hockey_curve':
        allInstruments = allInstruments.filter(x => x.analysis.hockey.status)
        break;
      case 'up':
        allInstruments = allInstruments.filter(x => x.analysis.upHill.status)
        break;
      case 'down':
        allInstruments = allInstruments.filter(x => x.analysis.downhill.status)
        break;
    }

    allInstruments = allInstruments.filter((eachInstrument) => {

      return eachInstrument.analysis.hockey.status || eachInstrument.analysis.downhill.status || eachInstrument.analysis.upHill.status
    })


    let onlyHockey = allInstruments.filter(x => x.analysis.hockey.status != false)
    allInstruments = allInstruments.filter(x => x.analysis.hockey.status == false)

    allInstruments = allInstruments.sort((a, b) => {
      return (b.analysis.downhill.status.toString().length - a.analysis.downhill.status.toString().length) || (b.analysis.upHill.status.toString().length - a.analysis.upHill.status.toString().length)
    })

    onlyHockey = onlyHockey.sort((b, a) => {
      return (a.analysis.hockey.status.toString().length - b.analysis.hockey.status.toString().length)
    })


    allInstruments = [...onlyHockey, ...allInstruments]

    if(allInstruments.length==0){
      
      let row = document.createElement('tr');
      let dataNotPresent = document.createElement('td');
      dataNotPresent.setAttribute('colspan',5);
      dataNotPresent.innerHTML = `Not enough data point.`
      row.appendChild(dataNotPresent);
      analyticsTableBody.append(row)
    }

    for (let i = 0; i < allInstruments.length; i++) {
      let eachInstrument = allInstruments[i];

      let row = document.createElement('tr');

      let td2 = document.createElement('td');
      td2.innerHTML = `<a class="deepLInk"  target="_blank" 
      href="https://kite.zerodha.com/chart/web/ciq/${eachInstrument.exchange}/${eachInstrument.name}/${eachInstrument.instrumentToken}" >
      ${eachInstrument.name}</a>`
      row.appendChild(td2);

      let td6 = document.createElement('td');
      td6.classList.add('text-center')
      td6.innerHTML = `${humanReadableStatus(eachInstrument.analysis.hockey.status)}`
      row.appendChild(td6);

      let td5 = document.createElement('td');
      td5.classList.add('text-center')
      td5.innerHTML = `${humanReadableStatus(eachInstrument.analysis.downhill.status)}`
      row.appendChild(td5);

      let upHillTd = document.createElement('td');
      upHillTd.classList.add('text-center')
      upHillTd.innerHTML = `${humanReadableStatus(eachInstrument.analysis.upHill.status)}`
      row.appendChild(upHillTd);



      let linksTd = document.createElement('td');
      let instrumentName = encodeURIComponent(eachInstrument.name);
      linksTd.innerHTML = generateLinks(instrumentName)
      row.appendChild(linksTd);
      analyticsTableBody.appendChild(row)
    }
  })

}

function humanReadableStatus(status) {
  if (status == false) {
    return '-';
  }
  if (status == true) {
    return 'Good'
  }
  return status
}
function sendMessage(msg) {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, msg);
    });
  });
}

window.addEventListener('load', init);