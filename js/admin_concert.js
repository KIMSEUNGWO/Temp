import {PageData, Pagination} from "./component/pagination.js";


const pagination = new Pagination('/idol', resultForm, [
    new PageData('word', () => document.querySelector('input[name="searchWord"]')?.value, (result) => {
        let word = (typeof result === 'object' && result != null) ? result.data.word : result;
        let searchWord = document.querySelector('input[name="searchWord"]');
        searchWord.value = word ?? '';
    }), 
]);

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.data) {
        pagination.onPopState(e.state.data);
    }
});

window.addEventListener('load', ()=>{
    //   최초검색
    pagination.search();
    

})

function resultForm(searchForm) {
    return `<a href="/match/" class="result">
                <button type="button" class="checkbox">
                    <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1 3.5C1 2.11929 2.11929 1 3.5 1H9.5C10.8807 1 12 2.11929 12 3.5V9.5C12 10.8807 10.8807 12 9.5 12H3.5C2.11929 12 1 10.8807 1 9.5V3.5ZM3.5 0C1.567 0 0 1.567 0 3.5V9.5C0 11.433 1.567 13 3.5 13H9.5C11.433 13 13 11.433 13 9.5V3.5C13 1.567 11.433 0 9.5 0H3.5ZM9.92326 4.64858C10.1206 4.42886 10.1206 4.07202 9.92326 3.85229H9.92484C9.72753 3.63257 9.40711 3.63257 9.2098 3.85229L5.52572 7.95327L3.86204 6.10229C3.66473 5.88257 3.34431 5.88257 3.147 6.10229C2.9497 6.32202 2.9497 6.67886 3.147 6.89858L5.16741 9.14858C5.36472 9.36831 5.68514 9.36831 5.88245 9.14858L9.92326 4.64858Z"/>
                    </svg>
                </button>
                <span>13213215</span>
                <span>2025-03-25 16:00</span>
                <span>Dream Walker Vol.1</span>
                <span>서울</span>
                <span>옥타바리움</span>
                <span>예매중</span>
            </a>`;
}