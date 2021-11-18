var cntr = document.querySelector(".trending-stocks");  //container for buttons
var txtr = document.querySelector(".textarea");         //block for qoute content
var region_select = document.querySelector(".select");  //select tag with user's choice of region 


//-----------------------------------searching trending stocks
var request = new XMLHttpRequest();

function handlerTrendingStocksRequest() {
    var status = request.status;

    if (status == 200) {
        txtr.value = '';
        var companiesinf = JSON.parse(request.responseText);
        var quotes = companiesinf.finance.result[0].quotes;
        var d = quotes.length;
        console.log(quotes);

        for (var i = 0; i < d; i++) {
            var btn = document.createElement('button');
            btn.id = quotes[i].symbol;
            btn.setAttribute("region", region_select.value);
            var btntxt = document.createTextNode(quotes[i].symbol);
            btn.appendChild(btntxt);
            btn.addEventListener('click', getQuoteInfo)
            cntr.appendChild(btn);
        }
    } else {
        console.log(request.statusText);
    }
}

function trendingStocksRequest(region) {
	//async request to open api
    var queryParam = encodeURIComponent(region);
    request.open('GET', 'https://yfapi.net/v1/finance/trending/' + queryParam, async = true);
    request.setRequestHeader('accept', 'application/json');
    request.setRequestHeader('X-API-KEY', 'vG7N5zRjGy80YrVwCug5L9uchVZmi9v92M6ifHZ3');

    request.onload = handlerTrendingStocksRequest;
    request.send();

}


function getTrendingStocks(event) {
	//invoke request with parser handler 
    if (cntr.childElementCount > 0) {
        cntr.innerHTML = '';
    }
	trendingStocksRequest(region_select.value);
	
}


//------------------------------------searching info about selected company
//------------------------------------возможно стоит переписать запрос getQuoteInfoRequest для получения инфы о нескольких компаниях(но мак. число = 10)
var request2 = new XMLHttpRequest();

function handlerQuoteInfoRequest() {
    var status = request.status;

    if (status = 200) {
        var quote = JSON.parse(request.responseText);
        var quoteInfo = quote.quoteResponse.result[0];
        console.log(quoteInfo);
        txtr.value = '';
        txtr.value = quoteInfo.shortName + quoteInfo.region + '    ' + quoteInfo.financialCurrency +
            '\n' + "Average Analyst Rating: " + quoteInfo.averageAnalystRating

            +
            '\n' + "Timezone Name: " + quoteInfo.exchangeTimezoneName +
            '\n' + "Market State: " + quoteInfo.marketState +
            '\n' + "Price To Book: " + quoteInfo.priceToBook;
    } else {
        console.log(request.statusText);
    }
	
}


function getQuoteInfoRequest(region, company) {
	//async request to open api
    var queryParam1 = "?region=" + encodeURIComponent(region);
    var queryParam2 = "&symbols=" + encodeURIComponent(company);
    
	request.open('GET', 'https://yfapi.net/v6/finance/quote' + queryParam1 + '&lang=en' + queryParam2, async = true);
    
	request.setRequestHeader('accept', 'application/json');
    request.setRequestHeader('X-API-KEY', 'vG7N5zRjGy80YrVwCug5L9uchVZmi9v92M6ifHZ3');

    request.onload = handlerQuoteInfoRequest;
    request.send();

}

function getQuoteInfo() {
    //invoke request with parser handler 
    getQuoteInfoRequest(this.region, this.id);
    txtr.textContent = this.id;
	
}

