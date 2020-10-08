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

News.getAndUpdateNewNewsCount=function(allNews){

    return new Promise((resolve,reject)=>{
        let newNews=0;
        let oldNews=JSON.parse(localStorage.getItem('newsStore')||'[]')
        for (let eachNews of allNews){
           
            let foundInOldNews=oldNews.findIndex(x=>x.title==eachNews.title);
            if(foundInOldNews==-1){
                newNews++;
                oldNews.push({
                    title:eachNews.title,
                    viewed:false,
                })
            }else{
                if(oldNews[foundInOldNews].viewed==false){
                    newNews++;
                }
            }
        }
        oldNews=oldNews.slice(0,50);
        localStorage.setItem('newsStore',JSON.stringify(oldNews))
        resolve(newNews);
    })

}

News.cleanNewNews=function(){

    return new Promise((resolve,reject)=>{
        let oldNews=JSON.parse(localStorage.getItem('newsStore')||'[]')
        for(let each of oldNews){
           // each.viewed=true;
        }
        localStorage.setItem('newsStore',JSON.stringify(oldNews))
        resolve();
    })

}


News.getAndUpdateNewStockAdviceCount=function(allAdvice){

    return new Promise((resolve,reject)=>{
        let newAdvice=0;
        let stockAdviceStore=JSON.parse(localStorage.getItem('stockAdviceStore')||'[]')
        for (let eachAdvice of allAdvice){
           
            let foundInOldStockAdvice=stockAdviceStore.findIndex(x=>x.title==eachAdvice.title);
            if(foundInOldStockAdvice==-1){
                newAdvice++;
                stockAdviceStore.push({
                    title:eachAdvice.title,
                    viewed:false,
                })
            }else{
                if(stockAdviceStore[foundInOldStockAdvice].viewed==false){
                    newAdvice++;
                }
            }
        }
        stockAdviceStore=stockAdviceStore.slice(0,50);
        localStorage.setItem('stockAdviceStore',JSON.stringify(stockAdviceStore))
        resolve(newAdvice);
    })

}

News.cleanStockAdvice=function(){

    return new Promise((resolve,reject)=>{
        let stockAdviceStore=JSON.parse(localStorage.getItem('stockAdviceStore')||'[]')
        for(let each of stockAdviceStore){
             each.viewed=true;
         }
        localStorage.setItem('stockAdviceStore',JSON.stringify(stockAdviceStore))
        resolve();
    })

}





News.updateView = function () {
    News.get().then(result => {
        setTimeout(_=>{
            News.cleanNewNews(result.news).then(_=>{
                let newsBadge=document.querySelector('#newsBadge');
                newsBadge.style.visibility='hidden';
                newsBadge.innerHTML='';
            });

        },1000)
       
    });
}

News.renderStocks=function(){
    News.get().then(result => {
        setTimeout(_=>{
            News.cleanStockAdvice(result.news).then(_=>{
                let stockBadge=document.querySelector('#stockBadge');
                stockBadge.style.visibility='hidden';
                stockBadge.innerHTML='';
            });

        },1000)
       
    });
}

setTimeout(_=>{
    News.get().then(result => {

        updateStockAdvice(result.recommendations,result.recommendationSources);
        updateNews(result.news)
    
    })
    
},10)

function updateNews(news) {
    let newsBody = document.querySelector('#newsBody');
    newsBody.innerHTML = '';
    let ul = document.createElement('ul');
    let allNews = news;


    if (allNews.length == 0 ) {
        newsBody.innerHTML = `No relevant news found for today till now. Check again after some time`;
    }

    News.getAndUpdateNewNewsCount(allNews).then(result=>{
        if(result>0){

            let newsBadge=document.querySelector('#newsBadge');
            newsBadge.style.visibility='unset';
            newsBadge.innerHTML=result;

        }
        
        console.log(result);
    })
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



    
    News.getAndUpdateNewStockAdviceCount(recommendations).then(result=>{
        if(result>0){

            let newsBadge=document.querySelector('#stockBadge');
            newsBadge.style.visibility='unset';
            newsBadge.innerHTML=result;

        }
        
        console.log(result);
    })

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
