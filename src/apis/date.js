// 本周第一天
function getWeekFirstDay() {
    let Nowdate = new Date();
    let WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    let _year = WeekFirstDay.getFullYear();
    let _month = WeekFirstDay.getMonth() + 1;
    if (_month < 10) _month = '0' + _month;
    let _day = WeekFirstDay.getDate();
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

// 本周最后天
function getWeekLastDay() {
    let Nowdate = new Date();
    let WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    let WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
    let _year = WeekLastDay.getFullYear();
    let _month = WeekLastDay.getMonth() + 1;
    if (_month < 10) _month = '0' + _month;
    let _day = WeekLastDay.getDate();
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

// 本月第一天
function getMonthFirstDay() {
    let Nowdate = new Date();
    let MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
    let _year = MonthFirstDay.getFullYear();
    let _month = MonthFirstDay.getMonth() + 1;
    if (_month < 10) _month = '0' + _month;
    let _day = MonthFirstDay.getDate();
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

// 本月最后一天
function getMonthLastDay() {
    let Nowdate = new Date();
    let MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
    let MonthLastDay = new Date(MonthNextFirstDay - 86400000);
    let _year = MonthLastDay.getFullYear();
    let _month = MonthLastDay.getMonth() + 1;
    if (_month < 10) _month = '0' + _month;
    let _day = MonthLastDay.getDate();
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

// 本季第一天
function getSeasonFirstDay() {
    let dateTime = new Date();
    let month = dateTime.getMonth();
    if (month < 3) {
        month = 1;
    } else if (month < 6) {
        month = 4;
    } else if (month < 9) {
        month = 7;
    } else {
        month = 10;
    }
    let _year = dateTime.getFullYear();
    let _month = month;
    if (_month < 10) _month = '0' + _month;
    let _day = 1;
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

// 本季最后一天
function getSeasonLastDay() {
    let dateTime = new Date();
    let month = dateTime.getMonth() + 1;
    if (month > 9) {
        month = 12;
    } else if (month > 6) {
        month = 9;
    } else if (month > 3) {
        month = 6;
    } else {
        month = 3;
    }
    let SeasonNextFirstDay = new Date(dateTime.getFullYear(), month, 1);
    let SeasonLastDay = new Date(SeasonNextFirstDay - 86400000);
    let _year = dateTime.getFullYear();
    let _month = month;
    if (_month < 10) _month = '0' + _month;
    let _day = SeasonLastDay.getDate();
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}


// 本年第一天
function getYearFirstDay() {
    let dateTime = new Date();
    let _year = dateTime.getFullYear();
    let _month = 1;
    if (_month < 10) _month = '0' + _month;
    let _day = 1;
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

// 本年最后一天
function getYearLastDay() {
    let dateTime = new Date();
    let _year = dateTime.getFullYear();
    let _month = 12;
    if (_month < 10) _month = '0' + _month;
    let _day = 31;
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

function addDay(time, day = 0) {
    let dateTime;
    if (time) {
        dateTime = new Date(time);
    } else {
        dateTime = new Date();
    }
    dateTime = dateTime.setDate(dateTime.getDate() + day);
    dateTime = new Date(dateTime);
    let _year = dateTime.getFullYear();
    let _month = dateTime.getMonth() + 1;
    if (_month < 10) _month = '0' + _month;
    let _day = dateTime.getDate();
    if (_day < 10) _day = '0' + _day;
    return _year + "-" + _month + "-" + _day;
}

export {
    getWeekFirstDay,
    getWeekLastDay,
    getMonthFirstDay,
    getMonthLastDay,
    getSeasonFirstDay,
    getSeasonLastDay,
    getYearFirstDay,
    getYearLastDay,
    addDay,
}
