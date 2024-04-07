/*
실행함수
*/
const main = () => {
    // checkMarketCap();
    getNasdaqList();
}

/*
* 시총 확인
*/
const checkMarketCap = async () => {

    const header = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
    }

    const formData = new FormData();

    formData.set('country[]', '5');
    formData.set('sector', '36,25,27,28,24,29,35,30,26,34,33,31,32');
    formData.set('industry', '182,190,204,199,212,177,172,207,214,217,179,184,203,181,185,197,222,215,220,202,200,187,229,209,210,192,195,193,228,206,218,205,208,194,183,196,178,230,225,223,216,173,174,180,188,201,211,232,186,226,175,227,231,213,219,198,221,191,189,176,224');
    formData.set('equityType', 'ORD,DRC,Preferred,Unit,ClosedEnd,REIT,ELKS,OpenEnd,Right,ParticipationShare,CapitalSecurity,PerpetualCapitalSecurity,GuaranteeCertificate,IGC,Warrant,SeniorNote,Debenture,ETF,ADR,ETC');
    formData.set('exchange[]', '2');
    formData.set('eq_market_cap[min]', '1');
    formData.set('eq_market_cap[max]', '3050000000000');
    formData.set('pn', '1');
    formData.set('order[col]', 'eq_market_cap');
    formData.set('order[dir]', 'd');

    const urlSearchParams = new URLSearchParams(formData);

    const result = await post('https://www.investing.com/stock-screener/Service/SearchStocks',urlSearchParams, header)

    const json = await result.json()
    // console.log(json)

    console.log('NASDAQ Top Market Cap Companies')

    console.log('no.\tStock Symbol\tMarket Capacity')

    json.hits
        .sort((a, b) => b.eq_market_cap-a.eq_market_cap)
        .forEach((data, index) => {
        console.log(`${index + 1}\t` +  data.stock_symbol + '\t\t' + convertToInternationalCurrencySystem(data.eq_market_cap) + '\t\t\t\t' + data.pair_ID)
    })
}

const getNasdaqList = async () => {
    const res = await get('https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt', {}, {})

    const text = await res.text();

    console.log(text.split('\n').map(val => {
        const list = val.split('|')

        return {
            symbol: list[0],
            securityName: list[1],
            marketCategory: list[2],
            testIssue: list[3],
            financialStatus: list[4],
            roundLotSize: list[5],
            etf: list[6],
            nextShares: list[7],
        }
    }))

}


const get = async (url, parameters = {}, headers) => {

    const keys = Object.keys(parameters);

    const parameterStringsArr = keys.map(key => `${key}=${parameters[key]}`);

    const parametersString = (parameterStringsArr.length > 0 ? '?': '') + parameterStringsArr.join('&');
    return _fetch(url + parametersString,  'GET', headers)
}

const post = async (url, body, headers) => {
    return _fetch(url, 'POST', headers, body)
}

const _fetch = async (url, method = 'GET', headers = {}, body) => {
    const option = {};

    option.headers = headers
    option.method = method
    option.body = body? body : null
    return fetch(url, option)
}

function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+12

        ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + " T"
        : Math.abs(Number(labelValue)) >= 1.0e+9

        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " B"
        // Six Zeroes for Millions
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " K"

                : Math.abs(Number(labelValue));

}

main();
