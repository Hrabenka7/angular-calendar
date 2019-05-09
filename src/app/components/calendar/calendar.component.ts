import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  daysList: Array<any>;
  monthIndex: any;
  month: any;
  monthsList: Array<string>;
  weekdaysList: Array<string>;
  year: number;
  yearsList: Array<number>;
  // day: number;


  constructor() { }

  ngOnInit() {
    this.daysList = [];
    this.monthIndex = moment().month();
    this.month = moment.months(this.monthIndex);
    this.monthsList = [];
    this.weekdaysList = [];
    this.year = moment().year();
    this.yearsList = [];

    // initialize calendar with current month data
    this.loadInitData();
  }

  loadInitData() {
    moment.locale('en_GB');

    // set Weekdays, Months, Year Lists
    this.monthsList = moment.months();
    this.weekdaysList = moment.weekdaysShort(true);
    for (let i = 2019; i <= 2029 ; i++) {  // add dynamic end condition e.g. current year + 10
      this.yearsList.push(i);
    }

    // set displayed days for current month
    const monthNumber = this.getMonthNumber(this.month);
    const daysObject = this.createDaysObject(this.year, monthNumber);
    this.setDisplayedDates(daysObject);

  }

  // get month number from month name
  getMonthNumber(monthName) {
    const monthNum = parseInt(moment().month(monthName).format('M'), 10); // monthIndex + 1
    return monthNum;
  }

  // prepare data for displayed dates calculation
  createDaysObject(year, month) {
    const selectedMonthLastDayIndex = moment([year, month - 1]).endOf('month').day();  // e.g Friday = 5
    const selectedMonthFirstDayDate = moment([year, month - 1]).startOf('month');
    const selectedMonthLastDayDate = moment([year, month - 1]).endOf('month');
    let previousMonthLastDayIndex;

    // subtract year if selected month is January
    if (month === 1) {
      previousMonthLastDayIndex = moment([year - 1, 11]).endOf('month').day();
    } else {
      previousMonthLastDayIndex = moment([year, month - 2]).endOf('month').day();
    }

    const daysObject = {
      previousMonthLastDayIndex,
      selectedMonthLastDayIndex,
      selectedMonthLastDayDate,
      selectedMonthFirstDayDate
    };

    return daysObject;
  }


  setDisplayedDates(daysObject) {
    this.daysList = [];

    const displayedDaysCountNextMonth = 7 - (daysObject.selectedMonthLastDayIndex);
    console.log('displayed Days of Next Month', displayedDaysCountNextMonth);

    const startSelectedMonth = daysObject.selectedMonthFirstDayDate;
    const endSelectedMonth = daysObject.selectedMonthLastDayDate;

    const startNextMonth = moment().startOf('month').add(1, 'month');
    const endNextMonthDisplay = moment().startOf('month').add(1, 'month').add(displayedDaysCountNextMonth - 1, 'day');

    const endPreviousMonth = moment().endOf('month').subtract(1, 'month');
    // tslint:disable-next-line:max-line-length
    const startPreviousMonthDisplay = moment().endOf('month').subtract(1, 'month').subtract(daysObject.previousMonthLastDayIndex - 1, 'day');

    this.setDaysListArray(startPreviousMonthDisplay, endPreviousMonth);
    this.setDaysListArray(startSelectedMonth, endSelectedMonth);
    this.setDaysListArray(startNextMonth, endNextMonthDisplay);

  }

  setDaysListArray(startDate, finalDate) {
    while (startDate <= finalDate) {
      const date = startDate.format('YYYY-MM-DD');
      const dayNumber = startDate.format('D');
      this.daysList.push(
        { date: date, day: dayNumber, temp: '', desc: '' }
      );
      startDate = startDate.clone().add(1, 'd');
    }
  }

  changeDate() {
    // rep!!!!!
    const monthNumber = this.getMonthNumber(this.month);
    const daysObject = this.createDaysObject(this.year, monthNumber);
    this.setDisplayedDates(daysObject);
  }
}
