import { fetchGet } from "./fetch.js";

export class Pagination {

    constructor(url, form, dataList) {
        this.url = window.location.pathname;
        this.getUrl = url + '/get';
        this.form = form;
        this.searchResultWrap = document.querySelector('#searchResult');
        const urlParams = new URLSearchParams(window.location.search);
        this.page = urlParams.get('page') != null ? Number(urlParams.get('page')) : 1;
        dataList.forEach(pageData => {
            pageData.setData(urlParams.get(pageData.name));
        });
        this.dataList = dataList;


        this.pageList = document.querySelector('.page_list');
        this.firstBtn = document.querySelector('#first-page');
        this.preBtn = document.querySelector('#prev-page');
        this.nextBtn = document.querySelector('#next-page');
        this.lastBtn = document.querySelector('#last-page');

        this.initBtnEventListener();
    }

    searchBtn() {
        this.page = 1;
        this.search();
    }
    search() {
        this.searchResultWrap.value = '';
        const request = this.getUrl + this.getParam();
        fetchGet(request, this.searchResult.bind(this));
    }


    searchResult(result) {
        const request = this.url + this.getParam();
        history.pushState({data : result}, '',  request);
        this.onPopState(result);
    }

    onPopState(result) {
        this.dataList.forEach(data => data.setData(result));

        const total = document.querySelector('.total');

        if (result.result !== 'OK') return;
        const pageable = result.data;

        this.pagination(pageable);

        if (pageable.content.length <= 0) {
            total != null ? total.innerHTML = '총 0건' : '';
            this.searchResultWrap.innerHTML = '<li class="none">검색 결과가 없습니다.</li>';
        } else {
            total != null ? total.innerHTML = '총 ' + pageable.totalElements + '건' : '';
            this.createFormList(pageable.content);
        }
    }

    createFormList(list) {
        let temp = ''
        for (let i=0;i<list.length;i++) {
            temp += this.form(list[i]);
        }
        this.searchResultWrap.innerHTML = temp;
    }

    pagination(pageable) {
        this.setBtn(pageable);
        this.setPage(pageable);
        this.pageEventListener();
    }

    setBtn(pageable) {
        this.totalPages = pageable.totalPages;

        this.firstBtn.disabled = (pageable.pageNumber < 1);
        this.preBtn.disabled = (pageable.pageNumber < 1);
        this.nextBtn.disabled = (pageable.pageNumber >= this.totalPages - 1);
        this.lastBtn.disabled = (pageable.pageNumber >= this.totalPages - 1);
    }
    setPage(pageable) {
        const count = 5;
        const currentPageNum = pageable.pageNumber;
        let pageCount = Math.floor(currentPageNum / 5);
        const startNum = Math.max(0, pageCount * count) + 1;
        this.createPageBtn(startNum, currentPageNum, count, pageable.totalPages);
    }

    createPageBtn(startNum, currentPageNum, count, lastPageNum) {
        this.pageList.innerHTML = '';
        for (let i=startNum;i < startNum+count && i <= lastPageNum;i++) {

            let li = document.createElement('li');
            li.classList.add('page');
            if (i === currentPageNum + 1) li.classList.add('selected');

            let btn = document.createElement('button');
            btn.type = 'button';
            btn.classList.add('page_link');
            btn.innerHTML = i;
            li.appendChild(btn);

            /*
                <li className="page selected">
                    <button type="button" class="page_link">1</button>
                </li>
            */

            this.pageList.appendChild(li);
        }
    }

    getParam() {
        let param = '?';
        let page = this.createParam('page', this.page);
        if (page != null) param += page;
        
        this.dataList.forEach(data => {
            let a = this.createParam(data.name, data.getData());
            if (a != null) param += '&' + a; 
        });

        return param;
    }
    createParam(key, value) {
        if (value === '' || value == null) return null;
        return `${key}=${value}`;
    }


    pageEventListener() {
        let pageBtn = document.querySelectorAll('.page_link');
        pageBtn.forEach(page => 
            page.addEventListener('click', () => {
                this.page = Number(page.textContent);
                this.search();
            })
        )
    }

    initBtnEventListener() {
        window.addEventListener('load', () => {
            this.firstBtn.addEventListener('click', () => {
                this.page = 1;
                this.search();
            })
            this.preBtn.addEventListener('click', () => {
                this.page = Math.max(0, this.page - 1);
                this.search();
            })
            this.nextBtn.addEventListener('click', () => {
                this.page = Math.min(this.totalPages, this.page + 1);
                this.search();
            })
            this.lastBtn.addEventListener('click', () => {
                this.page = this.totalPages;
                this.search();
            })

            const searchWord = document.querySelector('input[name="searchWord"]');
            searchWord?.addEventListener('keyup', (e)=>{
                if (searchWord.isEqualNode(e.target) && e.key === 'Enter') {
                    this.searchBtn();
                }
            })
            const searchBtn = document.querySelector('#search');
            searchBtn?.addEventListener('click', ()=>{
                this.searchBtn();
            })
        })


    }
}

export class PageData {

    constructor(name, getData, setData) {
        this.name = name;
        this.getData = getData;
        this.setData = setData;
    }
}