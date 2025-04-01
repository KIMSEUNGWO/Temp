import { LocalDate } from "./component/localdate.js";
import { Schedule, ScheduleManager } from "./component/schedule.js";

const now = new Date();
const localDate = new LocalDate();
const scheduls = new ScheduleManager();


window.addEventListener('load',() => {

    const preBtn = document.querySelector('#preButton');
    const nextBtn = document.querySelector('#nextButton');
    preBtn.addEventListener('click', () => {
        localDate.prev();
        renderCalendar();
    })

    nextBtn.addEventListener('click', () => {
        localDate.next();
        renderCalendar();
    })

    const mainMonth = document.querySelector('#mainMonth');
    const mainBody = document.querySelector('#mainBody');

    const renderCalendar = () => {
        render(mainMonth, mainBody);
        onChanged(localDate.year, localDate.month);
    }

    renderCalendar();

})


function render(header, body) {
    
    // 헤더 설정
    header.innerHTML = localDate.getHeader();
  
    // 캘린더 데이터 생성
    const calendarDates = localDate.generate();
    
    // 요일 헤더
    let temp = '<div class="week"><div class="cell"><div class="top"><span class="SUN">일</span></div></div><div class="cell"><div class="top">월</div></div><div class="cell"><div class="top">화</div></div><div class="cell"><div class="top">수</div></div><div class="cell"><div class="top">목</div></div><div class="cell"><div class="top">금</div></div><div class="cell SAT"><div class="top"><span class="SAT">토</span></div></div></div>';
    
    // 주 단위로 생성
    for (let i = 0; i < calendarDates.length; i += 7) {
      temp += '<div class="week">';
      
      // 한 주 생성
      for (let j = 0; j < 7 && (i + j) < calendarDates.length; j++) {
        const date = calendarDates[i + j];
        const day = date.getDate();
        const isToday = localDate.isToday(date);
        const isCurrentMonth = localDate.isCurrentMonth(date);
        
        let cellClass = '';
        if (j === 0) cellClass = 'SUN'; // 일요일
        else if (j === 6) cellClass = 'SAT'; // 토요일
        
        temp += `<div class="cell${!isCurrentMonth ? ' other' : ''}">
                    <div data-is-today="${isToday}"class="${cellClass}">${day}</div>
                    <ul class="scheduleList" aria-is-date="${dateToString(date)}"></ul>
                </div>`;
      }
      
      temp += '</div>';
    }
    
    body.innerHTML = temp;
}

function format(integer) {
    return String(integer).padStart(2, '0');
}

function dateToString(date) {
    return `${format(date.getFullYear())}-${format(date.getMonth() +1)}-${format(date.getDate())}`;
}


function onChanged(year, month) {
    
    scheduls.addAll(new Date(),[
        new Schedule(
            1,
            'Frame 1707485619.jpg',
            '어쨌든 새학기새학기새학기새학기새학기새학기새학기새학기새학기새학기새학기새학기새학기',
            new Date(2025, 1, 28, 16, 30)
        ),
        new Schedule(
            2,
            'Frame 1707485619.jpg',
            '어쨌든 새학기',
            new Date(2025, 2, 20, 16, 30)
        ),
        new Schedule(
            3,
            'Frame 1707485619.jpg',
            '22어쨌든 새학기',
            new Date(2025, 2, 20, 17, 20)
        ),
        new Schedule(
            5,
            'Frame 1707485619.jpg',
            '233어쨌든 새학기',
            new Date(2025, 2, 20, 19, 0)
        ),
    ]);
    scheduleRender();
}

function scheduleRender() {
    const currentMonth = `${format(localDate.year)}-${format(localDate.month)}`;
    let schedule = scheduls.get(currentMonth);
    
    if (!schedule) return; // 해당 월의 스케줄 데이터가 없으면 종료
    
    // 먼저 모든 scheduleList의 내용을 비웁니다 (중복 방지)
    const allScheduleLists = document.querySelectorAll('.scheduleList');
    allScheduleLists.forEach(ul => {
        ul.innerHTML = '';
    });
    
    // 새로운 스케줄 데이터를 추가합니다
    for (let dateKey in schedule) {
        if (!schedule.hasOwnProperty(dateKey)) continue;
        
        const ul = document.querySelector(`ul[aria-is-date="${dateKey}"]`);
        if (!ul) continue;
        
        let posters = '';
        schedule[dateKey].forEach(e => {
            posters += generateSchedule(e);
        });
        ul.innerHTML = posters; // 해당 날짜의 ul에만 콘텐츠 추가
    }
}

/**
 * 
 * @param {Schedule} schedule 
 */
function generateSchedule(schedule) {
    return `<li class="schedule">
                <a href="${schedule.id}">
                    <img src="${schedule.image}" alt="포스터" class="poster">
                    <div class="scheduleInfo">
                        <span class="openDate">OPEN <b>${getHours(schedule.dateTime)}</b></span>
                        <span class="title">${schedule.title}</span>
                    </div>
                </a>
            </li>`;
}


/**
 * 
 * @param {Date} date 
 */
function getHours(date) {
    return `${format(date.getHours())}:${format(date.getMinutes())}`;
}