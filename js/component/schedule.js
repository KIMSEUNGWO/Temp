export class ScheduleManager {

    /**
     * {
     *      '2025-03' : {
     *          '2025-02-23' : [ Schedule(), Schedule()],
     *          '2025-03-1' : [ Schedule(), Schedule()],
     *          '2025-03-31' : [ ],
     *      },
     * 
     * }
     */
    constructor() {
        this.map = {};
    }

    get(dateStr) {
        return this.map[dateStr];
    }

    /**
     * 
     * @param {Date} date 
     * @param {[Schedule]} scheduleList 
     */
    addAll(date, scheduleList) {
        // 월 단위 키 생성 (YYYY-MM 형식)
        const monthKey = this.dateToMonthKey(date);
        
        this.map[monthKey] = {};
        
        // scheduleList를 일자별로 그룹화
        for (let i = 0; i < scheduleList.length; i++) {
            const schedule = scheduleList[i];
            const scheduleDate = this.formatDateKey(schedule.dateTime);
            
            // 해당 날짜가 객체에 없으면 빈 배열로 초기화
            if (!this.map[monthKey][scheduleDate]) {
                this.map[monthKey][scheduleDate] = [];
            }
            
            // 스케줄 추가
            this.map[monthKey][scheduleDate].push(schedule);
        }
        
    }
    
    // 월단위의 키값 '2025-03'
    dateToMonthKey(date) {
        return `${this.format(date.getFullYear())}-${this.format(date.getMonth() + 1)}`;
    }
    format(integer) {
        return String(integer).padStart(2, '0');
    }

    // 각 스케줄의 데이트값
    formatDateKey(date) {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        }
        return date;
    }
    
    // 특정 날짜의 스케줄 가져오기
    getSchedules(date) {
        const dateKey = this.dateToString(date);
        return this.map[dateKey] || [];
    }
    
    // 모든 스케줄 데이터 제거
    clear() {
        this.map = {};
    }

    
}

export class Schedule {

    constructor(id, image, title, dateTime) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.dateTime = dateTime;
    }
}