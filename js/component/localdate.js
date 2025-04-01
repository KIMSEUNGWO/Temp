export class LocalDate {

    constructor() {
        this.today = new Date();
        this.year = this.today.getFullYear();
        this.month = this.today.getMonth() + 1;
        this.day = this.today.getDate();
    }

    getHeader() {
        return this.year + ". " + String(this.month).padStart(2, '0');
    }

    getLastDay() {
        return new Date(this.year, this.month, 0).getDate();
    }
    getStartWeek() {
        return new Date(this.year, this.month-1, 1).getDay();
    }

    prev() {
        if (this.month == 1) {
            this.month = 12;
            this.year--;
        } else {
            this.month--;
        }
    }

    next() {
        if (this.month == 12) {
            this.month = 1;
            this.year++;
        } else {
            this.month++;
        }
    }

    isToday(date) {
        return date.getDate() === this.today.getDate() &&
               date.getMonth() === this.today.getMonth() &&
               date.getFullYear() === this.today.getFullYear();
      }
    
      isCurrentMonth(date) {
        return date.getMonth() === this.month - 1;
      }

    generate() {
        const result = [];
        
        // 현재 월의 첫 날짜
        const firstDayOfMonth = new Date(this.year, this.month - 1, 1);
        
        // 첫 날짜의 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
        const startWeekday = firstDayOfMonth.getDay();
        
        // 이전 달의 마지막 날짜들 추가
        if (startWeekday > 0) {
          for (let i = startWeekday; i > 0; i--) {
            const prevDate = new Date(this.year, this.month -1, 1 - i);
            result.push(prevDate);
          }
        }
    

        // 현재 월의 일수
        const daysInMonth = new Date(this.year, this.month, 0).getDate();
        
        // 현재 달의 날짜들 추가
        for (let i = 0; i < daysInMonth; i++) {

          const currentDate = new Date(this.year, this.month - 1, 1 + i);
          result.push(currentDate);
        }
        
        // 다음 달의 첫 날짜들 추가 (6주 캘린더 완성을 위해)
        const remainingDays = 7 - (result.length % 7);

        if (remainingDays < 7) {
          for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(this.year, this.month - 1, daysInMonth + i);
            result.push(nextDate);
          }
        }
        
        return result;
      }
}