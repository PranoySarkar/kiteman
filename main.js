let encToken = null;
instrumentTokenMap = null;

chrome.runtime.onMessage.addListener(msg => {
    taskDispatcher(msg)
});


function taskDispatcher(msg) {
    switch (msg.task) {
        case 'SORT_INSTRUMENTS':
            sortInstruments(msg);
            break;
        case 'LATEST_UPDATE':
            latestUpdate();
            break;
        case 'GET_WATCH_LIST':
            let watchList = getWatchList();
            sendMessage({
                task: 'WATCH_LIST_UPDATE',
                watchList
            })
            getProfitAndLoss();
            break;
        case 'DISPLAY_LOG':
            console.log(msg.log);
            break
    }
}

function latestUpdate() {

    main();
    /*   let watchList = getWatchList();
      sendMessage({
          task: 'WATCH_LIST_UPDATE',
          watchList
      })
      updateCash(); */



}


//window.addEventListener('load', main)
//setInterval(doCheck, 5000)


function main() {
    isLoggedIn().then(_ => {

    }).then(_ => {
        return updateEncToken();
    })
        .then(enc => {
            encToken = enc;

            return getInstrumentTokens();
        }).then(_ => {
            updateProfitAndLoss();
            updateCash();
            sendMessage({
                task: 'WATCH_LIST_UPDATE',
                watchList: getWatchList()
            })
        })

        .catch(err => {
            console.error(err)
            sendMessage({
                task: 'USER_NOT_LOGGED_IN',
            })
        })
}
function doCheck() {
    updateProfitAndLoss();
}



function isLoggedIn() {
    return new Promise((resolve, reject) => {
        let notLoggedIn = [...document.querySelectorAll('button.button-orange')].some(btn => {
            return btn.innerHTML.trim().toLowerCase().includes('login')
        })
        if (notLoggedIn) {
            return reject();
        } else {
            return resolve();
        }
    })

}

function updateEncToken() {
    return new Promise((resolve, reject) => {
        let allCookies = document.cookie.split(';').map(eachCookie => {
            let matched = eachCookie.match(/(^.*?)=(.*?$)/)
            if (matched && matched.length >= 3) {
                return {
                    name: matched[1].trim(),
                    value: matched[2].trim()
                }
            }
            return {};

        })

        let enctoken = allCookies.find(eachCookie => {
            if (eachCookie.name.trim().toLowerCase() == 'enctoken') {
                return true;
            } else {
                return false;
            }
        })
        resolve(enctoken.value)
    })

}

function updateProfitAndLoss() {
    getHoldings()
        .then(holdings => {
            return {
                holdings: holdings.filter(eachStock => eachStock.quantity <= 0 ? false : true)
            }
        }).then(all => {
            return getPosition().then(positions => {
                positions = positions.filter(eachStock => eachStock.quantity <= 0 ? false : true)
                all.positions = positions.filter(eachStock => eachStock.buyPrice <= 0 ? false : true)
                return all;
            })
        })


        .then(all => {
            let totalInvested = 0;
            let totalCurrentValue = 0;

            all.holdings.forEach(holding => {
                totalInvested += holding.buyPrice * holding.quantity;
                totalCurrentValue += holding.currentPrice * holding.quantity;
            })

            all.positions.forEach(position => {
                totalInvested += position.buyPrice * position.quantity;
                totalCurrentValue += position.currentPrice * position.quantity;
            })

            all.profit = totalCurrentValue - totalInvested;
            all.profit = (Math.floor(all.profit * 100)) / 100
            all.invested = totalInvested;

            sendMessage({
                task: 'FUND_UPDATE',
                data: all
            })
        })
}


function updateCash() {

    fetch("https://kite.zerodha.com/oms/user/margins", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": `enctoken ${encToken}`,
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-site": "same-origin",
        },
        "referrer": "https://kite.zerodha.com/dashboard",
        "method": "GET",
        "credentials": "include"
    })
        .then(res => res.json())
        .then(margins => {
            data = margins.data.equity;
            sendMessage({
                task: 'CASH_UPDATE',
                data: data
            })
        });

}





function getWatchList() {
    let stocks = []

    document.querySelectorAll('.info').forEach(stockrow => {
        let dim = stockrow.querySelector('.dim');
        let lastPrice = stockrow.querySelector('.last-price');
        let niceName = stockrow.querySelector('.nice-name');
        if (dim && lastPrice && niceName) {
            let displacement = parseFloat(dim.innerText)
            lastPrice = parseFloat(lastPrice.innerText)
            let name = (niceName.innerText)
            let instrumentToken = '';
            let exchange = 'BSE'
            if (instrumentTokenMap &&  instrumentTokenMap[name]) {
                instrumentToken = instrumentTokenMap[name].instrumentToken;
                exchange = instrumentTokenMap[name].exchange;
            }
            stocks.push({ displacement, price: lastPrice, name, instrumentToken, exchange })
        }

    })

    stocks.sort((x, y) => {
        return y.displacement - x.displacement
    })

    return stocks;

}

function sortInstruments(msg) {
    let stocks = []
    document.querySelectorAll('.info').forEach(stockrow => {
        let dim = stockrow.querySelector('.dim');
        let lastPrice = stockrow.querySelector('.last-price');
        let niceName = stockrow.querySelector('.nice-name');
        if (dim && lastPrice && niceName) {
            let displacement = parseFloat(dim.innerText)
            lastPrice = parseFloat(lastPrice.innerText)
            let name = (niceName.innerText)
            stocks.push({ displacement, price: lastPrice, name, stockrow })
        }
    })
    if (msg.by == 'LOOSER') {
        stocks.sort((x, y) => {
            return x.displacement - y.displacement
        })
    } else {
        stocks.sort((x, y) => {
            return y.displacement - x.displacement
        })
    }

    document.querySelector('.instruments').querySelector('.vddl-list').style.display = 'grid';
    stocks.forEach((row, index) => {
        row.stockrow.parentElement.parentElement.style.gridRow = index + 1;
    })
}





function sendMessage(msg) {

    chrome.runtime.sendMessage(msg);
}





function getInstrumentTokens() {
    return new Promise((resolve, reject) => {
        fetch("https://kite.zerodha.com/api/marketwatch", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `enctoken ${encToken}`,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-site": "same-origin",
            },
            "referrer": "https://kite.zerodha.com/dashboard",
            "method": "GET",
            "credentials": "include"
        })
            .then(res => res.json())
            .then(holdings => {
                let allItems=[ holdings.data[0].items, holdings.data[1].items, holdings.data[2].items, holdings.data[3].items, holdings.data[4].items]
                let cleanData =allItems.map(eachHording => {
                    return {
                        [eachHording.tradingsymbol]: {
                            instrumentToken: eachHording.instrument_token,
                            exchange: eachHording.segment,
                        }

                    };
                });
                instrumentTokenMap = cleanData.reduce((a, b) => Object.assign(a, b));
                resolve();
            });
    })

}

function getHoldings() {
    return new Promise((resolve, reject) => {
        fetch("https://kite.zerodha.com/oms/portfolio/holdings", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `enctoken ${encToken}`,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-site": "same-origin",
            },
            "referrer": "https://kite.zerodha.com/dashboard",
            "method": "GET",
            "credentials": "include"
        })
            .then(res => res.json())
            .then(holdings => {
                let cleanData = holdings.data.map(eachHording => {
                    /** // after T1 JKLAKSHMI  
                     * {
                        "tradingsymbol": "JKLAKSHMI",
                        "exchange": "NSE",
                        "instrument_token": 3453697,
                        "isin": "INE786A01032",
                        "product": "CNC",
                        "price": 0,
                        "quantity": 5,
                        "t1_quantity": 11,
                        "realised_quantity": 5,
                        "authorised_quantity": 0,
                        "opening_quantity": 16,
                        "collateral_quantity": 0,
                        "collateral_type": "",
                        "discrepancy": false,
                        "average_price": 260.875,
                        "last_price": 254.6,
                        "close_price": 253.4,
                        "pnl": -100.40000000000009,
                        "day_change": 1.1999999999999886,
                        "day_change_percentage": 0.47355958958168454
                        }
                     *  check for cell & new buy
                     */

                    /**
                     * {
                        "tradingsymbol": "RELIANCE",
                        "exchange": "NSE",
                        "instrument_token": 738561,
                        "isin": "INE002A01018",
                        "product": "CNC",
                        "price": 0,
                        "quantity": 0,
                        "t1_quantity": 0,
                        "realised_quantity": 0,
                        "authorised_quantity": 0,
                        "opening_quantity": 1,
                        "collateral_quantity": 0,
                        "collateral_type": "",
                        "discrepancy": false,
                        "average_price": 2153.6,
                        "last_price": 2280.95,
                        "close_price": 2161.35,
                        "pnl": 0,
                        "day_change": 119.59999999999991,
                        "day_change_percentage": 5.533578550443006
                        }
                     */
                    return {
                        name: eachHording.tradingsymbol,
                        buyPrice: eachHording.average_price,
                        instrumentToken: eachHording.instrument_token,
                        currentPrice: eachHording.last_price,
                        exchange: eachHording.exchange,
                        quantity: eachHording.t1_quantity+eachHording.quantity
                    };
                });
                resolve(cleanData);
            });
    })

}

function getPosition() {
    return new Promise((resolve, reject) => {
        fetch("https://kite.zerodha.com/oms/portfolio/positions", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `enctoken ${encToken}`,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-site": "same-origin",
            },
            "referrer": "https://kite.zerodha.com/dashboard",
            "method": "GET",
            "credentials": "include"
        })
            .then(res => res.json())
            .then(positions => {
                let cleanData = positions.data.net.map(eachPosition => {
                    return {
                        name: eachPosition.tradingsymbol,
                        buyPrice: eachPosition.average_price,
                        currentPrice: eachPosition.last_price,
                        instrumentToken: eachPosition.instrument_token,
                        exchange: eachPosition.exchange,
                        quantity: eachPosition.quantity || eachPosition.buy_quantity || eachPosition.day_buy_quantity || eachPosition.opening_quantity || eachPosition.t1_quantity
                    };
                });
                resolve(cleanData);
            });
    })
}

