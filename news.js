const News = {};
let newsFromNetwork=null;

News.get = function () {
    return new Promise((resolve, reject) => {
        if(newsFromNetwork){
            return resolve(newsFromNetwork);
        }
        fetch(`https://prnysarker.github.io/kiteman/news.json?date=${new Date().getTime()}`)
            .then(r => r.json()).then(responseBody => {
                newsFromNetwork=responseBody;
                return resolve(responseBody)
            }).catch(err => {
                console.error(err);
                return resolve({})
            })
    })
}



News.updateView = function () {
    News.get().then(result => {

        updateStockAdvice(result.recommendations,result.recommendationSources);
        updateNews(result.news)


    })

}

function updateNews(news) {
    let newsBody = document.querySelector('#newsBody');
    newsBody.innerHTML = '';
    let ul = document.createElement('ul');
    let allNews = news.filter(eachNews => {
        return new Date().getDate() === new Date(eachNews.date).getDate();
    });


    if (allNews.length == 0 ) {
        newsBody.innerHTML = `No relevant news found for today till now. Check again after some time`;
    }

    allNews.forEach(eachNews => {
        let li = document.createElement('li');
        li.innerHTML = `<span class="headline">${eachNews.title}</span>`;
    
        if (eachNews.instrumentName && eachNews.instrumentName != 'unknown' ) {
            let anchor = document.createElement('a');
            anchor.classList.add('iconLink');
            anchor.classList.add('openLink');
            anchor.setAttribute('target', '_blank');
            anchor.innerHTML = '&nbsp;&nbsp;&nbsp;';
            anchor.href = `http://www.google.com/search?q=${eachNews.instrumentName} stock`;
            li.append(anchor);
        }

        let sourcesSpan= document.createElement('span');
        sourcesSpan.innerHTML='<span class="readMore">Read More</span>'
        eachNews.sources.forEach(source=>{
            let anchor = document.createElement('a');
            anchor.classList.add('sourceLink');
            anchor.setAttribute('target', '_blank');
            anchor.innerHTML = source.name;
            anchor.href = source.url
            sourcesSpan.append(anchor);
        })
        li.append(sourcesSpan);

        ul.appendChild(li);
    });
    newsBody.append(ul);
}


function updateStockAdvice(newsRecommendations,recommendationSources) {
    let stockAdviceBody = document.querySelector('#stockAdviceBody');
    stockAdviceBody.innerHTML = '';
    let ul = document.createElement('ul');
    let recommendations = newsRecommendations.filter(eachAdvice => {
        return new Date().getDate() === new Date(eachAdvice.date).getDate();
    });


    if (recommendations.length == 0 ) {
        stockAdviceBody.innerHTML = `No good recommendations found for today till now. Check again after some time`;
    }

    recommendations.forEach(eachAdvice => {
        let li = document.createElement('li');
        li.innerHTML = `<span>${eachAdvice.title}</span>`;
        li.classList.add(`type-${eachAdvice.type}`);

        if (eachAdvice.strong && eachAdvice.strong > 1) {
            let span = document.createElement('span');
            span.classList.add('strongIndicator');
            span.innerHTML = `multiple sources`;
            span.title = 'Backed by multiple sources';
            li.append(span);
        }

        if (eachAdvice.instrumentName && eachAdvice.instrumentName != 'unknown') {
            let anchor = document.createElement('a');
            anchor.classList.add('iconLink');
            anchor.classList.add('openLink');
            anchor.setAttribute('target', '_blank');
            anchor.innerHTML = '&nbsp;&nbsp;&nbsp;';
            anchor.href = `http://www.google.com/search?q=${eachAdvice.instrumentName} stock`;
            li.append(anchor);
        }
        ul.appendChild(li);
    });
    stockAdviceBody.append(ul);

    let stockAdviceList= document.querySelector('.stockAdviceList');
    stockAdviceList.innerHTML=` <span class='label'>Get more stock advice from</span>`;
    let recommendationSourcesUl = document.createElement('ul');
    recommendationSources.forEach(eachRecoSource => {
        let li = document.createElement('li');

        if (eachRecoSource.name && eachRecoSource.url ) {
            let anchor = document.createElement('a');
            anchor.classList.add('stockAdviceLink');
            anchor.setAttribute('target', '_blank');
            anchor.innerHTML = eachRecoSource.name;
            anchor.href = eachRecoSource.url;
            li.append(anchor);
        }
        recommendationSourcesUl.appendChild(li);
    });

    stockAdviceList.append(recommendationSourcesUl)
 
    

}
