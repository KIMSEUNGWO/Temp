const date = new Date();

const fixYear = date.getFullYear();
const fixMonth = date.getMonth() + 1;
const fixDay = date.getDate();

let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();


const afterYear = date.getFullYear();
const afterMonth = date.getMonth();
const afterDay = date.getDate() + 30; // 30일 후까지 
const afterDate = new Date(afterYear, afterMonth, afterDay);

window.addEventListener('load', () => {


    let preBtn = document.querySelector('#preButton');
    let nextBtn = document.querySelector('#nextButton');

    let matchDate = document.querySelector('input[name="matchDate"]');
    let calendar = document.querySelector('#date_range_calendar');

    matchDate.addEventListener('click', () => {
        calendar.classList.toggle('display');
    })

    let renderCalendar = () => {
        let mainMonth = document.querySelector('#mainMonth');
        let mainBody = document.querySelector('#mainBody');
        lender(mainMonth, mainBody, year, month);

        // 이번달 기준 1달 후까지 표시
        let calDate = new Date(year, month-1, 0);
        let compareDate = new Date(fixYear, fixMonth, 0);

        nextBtn.disabled = (calDate.getTime() >= compareDate.getTime());
        preBtn.disabled = (year == fixYear && month == fixMonth);

        if (new Date(year, month, 1).getTime() > afterDate.getTime()) {
            nextBtn.disabled = true;
        }
        checkToday(year, month);
        // 오늘 이전인 날은 data-is-disabled = "true"로 변경
        checkBefore(year, month);
        // 오늘 + 14일 후  부 data-is-disabled = "true"로 변경
        checkLimit(year, month);
    
    }

    renderCalendar();
    initial();
    setTime(document.querySelector('.cell button[data-is-today="true"]'));

    preBtn.addEventListener('click', () => {
        if (month == 1) {
            month = 12;
            year--;
        } else {
            month--;
        }
        renderCalendar();
    })

    nextBtn.addEventListener('click', () => {
        if (month-1 == 12) {
            month = 1;
            year++;
        } else {
            month++;
        }

        renderCalendar();
    })


    this.document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('aria-pressed') && e.target.getAttribute('data-is-disabled') == 'false') {
            clearRange();
            e.target.setAttribute('aria-pressed', 'true');
            let clickDate = clickAndGetDate(e.target);

            let match = document.querySelector('input[name="matchDate"]');

            let innerDate = dateForm(clickDate.getFullYear(), clickDate.getMonth()+1, clickDate.getDate());

            match.value = innerDate;
            setTime(e.target)
            calendar.classList.remove('display');
        }
    })

})

function setTime(target) {
    const select = document.querySelector('select[name="matchHour"]');
    
    let dateHour = 0;
    if (target.getAttribute('data-is-today') == 'true') {
        dateHour = new Date().getHours() + 2;
        if (dateHour > 24) {
            alert('오늘은 더 이상 경기를 추가할 수 없습니다.');
            select.innerHTML = '';
            return;
        }    
    }

    let temp = '';
    for (let i=dateHour;i<=24;i++) {
        let time = String(i).padStart(2, '0');
        temp += `<option value="${time}:00">${time}:00</option>`;
        temp += `<option value="${time}:30">${time}:30</option>`;
    }
    select.innerHTML = temp;
}
function initial() {
    let today = document.querySelector('button[data-is-today="true"]');
    today.setAttribute('aria-pressed', 'true');
    let clickDate = clickAndGetDate(today);
    let match = document.querySelector('input[name="matchDate"]');
    let innerDate = dateForm(clickDate.getFullYear(), clickDate.getMonth()+1, clickDate.getDate());
    match.value = innerDate;
}

function clickAndGetDate(target) {
    let parentId = target.parentElement.parentElement.parentElement.id;

    let withinDay = Number(target.textContent);
    
    let lMonth = document.querySelector('#mainMonth').textContent;
    let lArray = lMonth.split(". ");
    return new Date(Number(lArray[0]), Number(lArray[1])-1, withinDay);
}

function clearRange() {
    let allBtn = document.querySelectorAll('button[aria-pressed="true"]');
    allBtn.forEach(el => {
        el.setAttribute('aria-pressed', 'false');
    })
}

function checkToday(checkYear, checkMonth) {
    if (fixYear == checkYear && fixMonth == checkMonth) {
        let selector = '#mainBody button[data-is-today="false"]';
        let cellList = document.querySelectorAll(selector);
        cellList[fixDay-1].setAttribute('data-is-today', 'true');
    }
}

function checkBefore(checkYear, checkMonth) {
    if (fixYear > checkYear || (fixYear == checkYear && fixMonth > checkMonth)) {
        drawBefore();
        return
    }
    if (fixYear == checkYear && fixMonth == checkMonth) {
        drawBefore();
        return;
    }
}
function drawBefore() {
    let selector = '#mainBody button[data-is-disabled="false"]';
    let cellList = document.querySelectorAll(selector);
    for (let i=0;i<cellList.length;i++) {
        if (cellList[i].getAttribute('data-is-today') == 'true'){
            return;
        }
        cellList[i].setAttribute('data-is-disabled', 'true');
    }
}
function checkLimit(checkYear, checkMonth) {
    if (afterYear > checkYear) return;
    if (afterYear == checkYear && afterMonth > checkMonth) return;

    let selector = '#mainBody button[data-is-disabled="false"]';
    let cellList = document.querySelectorAll(selector);

    for (let i=0;i<cellList.length;i++) {
        let checkDay = Number(cellList[i].textContent);
        let newDate = new Date(checkYear, checkMonth-1, checkDay);
        if (newDate.getTime() > afterDate.getTime()) {
            cellList[i].setAttribute('data-is-disabled', true);
        }
    }
}

function drawToday() {
    let selector = '#mainBody button[data-is-today="false"]';
    let cellList = document.querySelectorAll(selector);
    cellList[fixDay-1].setAttribute('data-is-today', 'true');
}

function lender(header, body, year, month) {
    // 2023. 11 형식
    if (month == 0) {
        year--;
        month = 12;
    }
    if (month == 13) {
        year++;
        month = 1;
    }
    header.innerHTML = year + ". " + String(month).padStart(2, '0');

    // 현재월의 마지막날
    let lastDateMonth = new Date(year, month, 0).getDate();
    // 현재달 시작요일
    let startDateMonth = new Date(year, month-1, 1).getDay();
    

    let temp = '<div class="week"><div class="cell SUN"><div>일</div></div><div class="cell"><div>월</div></div><div class="cell"><div>화</div></div><div class="cell"><div>수</div></div><div class="cell"><div>목</div></div><div class="cell"><div>금</div></div><div class="cell SAT"><div>토</div></div></div></div>';
    let now = 1;

    while (now <= lastDateMonth) {
        temp +=  '<div class="week">' + createWeek(now, lastDateMonth, startDateMonth) + '</div>';
        now += 7 - startDateMonth;
        startDateMonth = 0;
    }
    
    body.innerHTML = temp;
}


function createWeek(now, lastDateMonth, startDateMonth) {
    let temp = '';
    for (let i=startDateMonth;i<7;i++) {
        if (now <= lastDateMonth) {
            if (i == 0) { // 일요일
                temp += '<div class="cell"><button type="button" aria-pressed="false" data-is-disabled="false" data-is-today="false" class="SUN">' + now + '</button></div>'
            }
            else if (i == 6) { // 토요일
                temp += '<div class="cell"><button type="button" aria-pressed="false" data-is-disabled="false" data-is-today="false" class="SAT">' + now + '</button></div>'
            }
            else {
                temp += '<div class="cell"><button type="button" aria-pressed="false" data-is-disabled="false" data-is-today="false">' + now + '</button></div>'
            }
            now++;
        }
    }
    return temp;
}

function clearDate() {
    let matchDate = document.querySelector('input[name="matchDate"]');
    matchDate.value = ''
}

function getDate(value) {
    if (value == '') {
        return null;
    }
    let split = value.split("/");
    let array = [];
    array.push(split[0]);
    array.push(split[1]);
    array.push(split[2]);
    return array;
}
function dateForm(year, month, day) {
    return year + '/' + String(month).padStart(2, '0') + '/' + String(day).padStart(2, '0');
}
function getDateForm(date) {
    let split = date.value.split('/');
    return new Date(Number(split[0]), Number(split[1])-1, Number(split[2]));
}