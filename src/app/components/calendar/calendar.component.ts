import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  daysList: Array<any>;
  monthsList: Array<string>;
  weekdaysList: Array<string>;
  yearsList: Array<number>;

  year: number;
  monthIndex: any;
  month: any;
  // day: number;


  constructor() { }

  ngOnInit() {
    this.daysList = [];
    this.monthsList = [];
    this.yearsList = [];
    this.weekdaysList = [];

    this.year = moment().year();
    this.monthIndex = moment().month();
    this.month = moment.months(this.monthIndex);

    this.loadLists();
  }

  loadLists() {
    moment.locale('en_GB');

    // -------- Set Weekdays, Months, Year Lists ---------- //
    this.monthsList = moment.months();
    for (let i = 2019; i <= 2029 ; i++) {
      this.yearsList.push(i);
    }
    this.weekdaysList = moment.weekdaysShort(true);


    // ------------- Set daysList array current month -----------//
    for (let i = 1; i <= 31; i++) {
      this.daysList.push(i);
    }

  }


  changeDate() {

  }
}
