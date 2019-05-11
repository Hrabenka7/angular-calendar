import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { WeatherService } from '../../services/weather.service';
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
  weatherArray: Array<any>;
  currentDate: any;
  numberDaysDisplayPrevMonth: number;
  displayedDaysCountNextMonth: number;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.daysList = [];
    this.monthIndex = moment().month();
    this.month = moment.months(this.monthIndex);
    this.monthsList = [];
    this.weekdaysList = [];
    this.year = moment().year();
    this.yearsList = [];
    this.weatherArray = [];
    this.currentDate = moment().format('YYYY-MM-DD');
    this.displayedDaysCountNextMonth = 0;

    // initialize calendar with current month data
    this.loadInitData();

    this.weatherService.getWeatherForecast()
      .subscribe((data => {
        this.fillWeatherArray(data);
        this.addWeatherToDays();
      }));
  }

  loadInitData() {
    moment.locale('en_GB');

    // set Weekdays, Months, Year Lists
    this.monthsList = moment.months();
    this.weekdaysList = moment.weekdaysShort(true);
    for (let i = 2019; i <= 2029; i++) {  // add dynamic end condition e.g. current year + 10
      this.yearsList.push(i);
    }

    // set displayed days for current month
    const monthNumber = this.getMonthNumber(this.month);
    const daysObject = this.createDaysObject(this.year, monthNumber);
    this.setDisplayedDates(daysObject);

    console.log('daysList', this.daysList);
    console.log('cur', this.currentDate);
    console.log('random date', this.daysList[3].date);

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

    this.displayedDaysCountNextMonth = 7 - (daysObject.selectedMonthLastDayIndex);
    console.log('displayed Days of Next Month', this.displayedDaysCountNextMonth);

    const startSelectedMonth = daysObject.selectedMonthFirstDayDate;
    const endSelectedMonth = daysObject.selectedMonthLastDayDate;

    const startNextMonth = moment().startOf('month').add(1, 'month');
    const endNextMonthDisplay = moment().startOf('month').add(1, 'month').add(this.displayedDaysCountNextMonth - 1, 'day');

    const endPreviousMonth = moment().endOf('month').subtract(1, 'month');
    // tslint:disable-next-line:max-line-length
    const startPreviousMonthDisplay = moment().endOf('month').subtract(1, 'month').subtract(daysObject.previousMonthLastDayIndex - 1, 'day');

    this.numberDaysDisplayPrevMonth = endPreviousMonth.diff(startPreviousMonthDisplay, 'days');
    console.log('grey days beginning', this.numberDaysDisplayPrevMonth);

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

    // if the date is changed back to current or one month after
    if ((monthNumber - 1 === moment().month() || monthNumber === moment().month()) && this.year == moment().year()) {
      this.weatherService.getWeatherForecast()
        .subscribe((data => {
          this.fillWeatherArray(data);
          this.addWeatherToDays();
        }));
    }
  }

  // filter weather received from api into one temperature per day
  fillWeatherArray(data) {
    // tslint:disable-next-line:no-string-literal
    data['list'].forEach(element => {
      const dateFormated = moment(element.dt_txt).format('YYYY-MM-DD');
      if (this.weatherArray.length === 0 || dateFormated !== this.weatherArray[this.weatherArray.length - 1].date) {
        const obj = {
          date: dateFormated,
          temp: element.main.temp,
          desc: element.weather[0].main
        };
        this.weatherArray.push(obj);
      }
    });
  }

  // merge arrays. Add weather for specific dates into dayList array
  addWeatherToDays() {
    for (const day of this.daysList) {
      for (const weather of this.weatherArray) {
        if (day.date === weather.date) {
          day.desc = weather.desc,
            day.temp = '(' + Math.round(weather.temp) + '°C)';
        }
      }
    }
  }
}
