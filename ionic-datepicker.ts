import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  styles:[
    `
    .ionic_datepicker_modal_content {
      ion-row {
        padding: 4px;
      }
      ion-col {
        text-align: center;
        margin: auto;
      }
      .font_bold {
        font-weight: bold;
      } 
      .label-md{
        display: none;
      }
      ion-select{
        max-width: 100%;
        width: 100%;
      }
      .select-md {
        padding: 5px;
      }
      .date_cell{
        padding: 5px;
      }
      .disabled{
        pointer-events: none;
        color: #aaa;
      }
      .today{
        border: 1px solid #387ef5;
        border-radius: 2px;
        color: #000;
      }
      .selected_date{
        color: #fff;
        font-weight: bold;
        border-radius: 2px;
        background-color: #387ef5;
      }
    }
  `
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <!-- <span [innerHTML]="selectedDate"></span> -->
          {{ selectedDate | date: config.dateFormat }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ionic_datepicker_modal_content">
      <ion-list>
        <ion-grid>
          <ion-row class="center">
            <ion-col width-10 (click)="prevMonth(daysList[daysList.length - 1])" [ngClass]="{disabled: (prevDisabled)}">
              <ion-icon ios="ios-arrow-back" md="md-arrow-back"></ion-icon>
            </ion-col>
            <ion-col width-80>
              <!--<span [innerHTML]="months[daysList[daysList.length - 1].month]"></span>
              <span> - </span>
              <span [innerHTML]="daysList[daysList.length - 1].year"></span>-->
              <ion-row class="center">
                <ion-col width-50>
                  <ion-item>
                    <ion-label>Month</ion-label>
                    <ion-select [(ngModel)]="selectedMonth" (ionChange)="monthSelected($event,selectedMonth)">
                      <ion-option [value]="month" *ngFor="let month of config.monthsList" [innerHTML]="month"></ion-option>
                    </ion-select>
                  </ion-item>
                </ion-col>
                <ion-col width-50>
                  <ion-item>
                    <ion-label>Year</ion-label>
                    <ion-select [(ngModel)]="selectedYear" (ionChange)="yearSelected($event,selectedYear)">
                      <ion-option [value]="year" *ngFor="let year of years" [innerHTML]="year"></ion-option>
                    </ion-select>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-col>
            <ion-col width-10 (click)="nextMonth(daysList[daysList.length - 1])" [ngClass]="{disabled: (nextDisabled)}">
              <ion-icon ios="ios-arrow-forward" md="md-arrow-forward"></ion-icon>
            </ion-col>
          </ion-row>
          <ion-row class="center">
            <ion-col width-10 *ngFor="let week of config.weeksList" [innerHTML]="week" class="font_bold"></ion-col>
          </ion-row>
          <ion-row class="center" *ngFor="let row of rows">
            <ion-col width-10 *ngFor="let col of cols">
              <span *ngIf="daysList[row + col]" class="date_cell" [innerHTML]="daysList[row + col].date" (click)="dateClicked(daysList[row + col])" [ngClass]="{today: (today.getTime() == daysList[row + col].epoch), selected_date: (selectedDate.getTime() == daysList[row + col].epoch), disabled: (!daysList[row + col].enabled)}"></span>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons start (click)="setDate()">
          <button ion-button color="royal" [innerHTML]="config.setLabel"></button>
        </ion-buttons>
        <ion-buttons center (click)="setToday()">
          <button ion-button color="royal" [innerHTML]="config.todayLabel"></button>
        </ion-buttons>
        <ion-buttons end (click)="dismiss()">
          <button ion-button color="royal" [innerHTML]="config.closeLabel"></button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class IonicDatepicker {
  weeks;
  months;
  years;
  daysList;
  rows;
  cols;
  firstDay;
  selectedDate;
  selectedMonth;
  selectedYear;
  today;
  config;
  prevDisabled;
  nextDisabled;

  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.selectedDate = new Date();
    let weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.years = this.getYearsList();
    this.rows = [0, 7, 14, 21, 28, 35];
    this.cols = [0, 1, 2, 3, 4, 5, 6];

    this.config = this.params.data.datepickerConfig || {};
    this.config.inputDate = this.config.inputDate ? this.resetHMSM(new Date(this.config.inputDate)) : this.resetHMSM(new Date());
    this.config.fromDate = this.config.fromDate ? this.resetHMSM(new Date(this.config.fromDate)) : null;
    this.config.toDate = this.config.toDate ? this.resetHMSM(new Date(this.config.toDate)) : null;
    this.config.disabledDates = this.config.disabledDates ? this.prepareDisabledDates(this.config.disabledDates) : [];
    this.config.setLabel = this.config.setLabel ? this.config.setLabel : 'Set';
    this.config.todayLabel = this.config.todayLabel ? this.config.todayLabel : 'Today';
    this.config.closeLabel = this.config.closeLabel ? this.config.closeLabel : 'Close';
    this.config.mondayFirst = this.config.mondayFirst ? this.config.mondayFirst : false;
    this.config.weeksList = this.config.weeksList ? this.config.weeksList : weeks;
    this.config.monthsList = this.config.monthsList ? this.config.monthsList : months;
    this.config.dateFormat = this.config.dateFormat ? this.config.dateFormat : 'dd MMMM yyyy';
    this.config.showTodayButton = this.config.showTodayButton ? this.config.showTodayButton : true;
    this.config.closeOnSelect = this.config.closeOnSelect ? this.config.closeOnSelect : false;
    this.today = this.resetHMSM(new Date());
    let currentDate = this.resetHMSM(new Date(this.config.inputDate));
    this.selectedMonth = this.config.monthsList[currentDate.getMonth()];
    this.selectedYear = currentDate.getFullYear();
    this.loadDaysList(currentDate);
  }

  prepareDisabledDates(disbaledDates) {
    disbaledDates.forEach((disbaledDate,i )=> {
      disbaledDates[i] = this.resetHMSM(new Date(disbaledDate)).getTime();
    });
    return disbaledDates;
  }

  resetHMSM(currentDate) {
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    return currentDate;
  }

  getYearsList() {
    let yearsList = [];
    for (let year = 1900; year <= 2100; year++) {
      yearsList.push(year);
    }
    return yearsList;
  }

  loadDaysList(ipDate) {
    this.daysList = [];
    let firstDay = new Date(ipDate.getFullYear(), ipDate.getMonth(), 1).getDate();
    let lastDay = new Date(ipDate.getFullYear(), ipDate.getMonth() + 1, 0).getDate();

    for (let i = firstDay; i <= lastDay; i++) {
      let tempDate = new Date(ipDate.getFullYear(), ipDate.getMonth(), i);
      if (i === firstDay) {
        this.prevDisabled = tempDate.getTime() < this.config.fromDate.getTime();
      }
      if (i === lastDay) {
        this.nextDisabled = tempDate.getTime() > this.config.toDate.getTime();
      }
 
      let isEnabled = ((this.config.fromDate && this.config.toDate) ? (this.config.fromDate.getTime() <= tempDate.getTime() && this.config.toDate.getTime() >= tempDate.getTime()) : ((this.config.fromDate && !this.config.toDate) ? (this.config.fromDate.getTime() <= tempDate.getTime()) : this.config.toDate.getTime() >= tempDate.getTime())) && (this.config.disabledDates.indexOf(tempDate.getTime()) < 0);
      
      this.daysList.push({
        date: tempDate.getDate(),
        month: tempDate.getMonth(),
        year: tempDate.getFullYear(),
        day: tempDate.getDay(),
        epoch: tempDate.getTime(),
        enabled: isEnabled
      });
    }

    firstDay = this.daysList[0].day;

    for (let j = 0; j < firstDay; j++) {
      this.daysList.unshift({});
    }
  }

  monthSelected(event, selectedMonth) {
    this.selectedMonth = selectedMonth;
    this.selectedDate.setMonth(this.config.monthsList.indexOf(this.selectedMonth));
    this.selectedDate.setYear(this.selectedYear);
    this.loadDaysList(new Date(this.selectedDate));
  }

  yearSelected(event, selectedYear) {
    this.selectedYear = selectedYear;
    this.selectedDate.setMonth(this.config.monthsList.indexOf(this.selectedMonth));
    this.selectedDate.setYear(this.selectedYear);
    this.loadDaysList(new Date(this.selectedDate));
  }

  dateClicked(dateObj) {
    this.selectedDate = new Date(dateObj.epoch);
  }

  prevMonth(dateObj) {
    let date = new Date(dateObj.epoch);
    date.setDate(date.getDate() - dateObj.date);
    this.selectedMonth = this.config.monthsList[date.getMonth()];
    this.selectedYear = date.getFullYear();
    this.loadDaysList(new Date(date));
  }

  nextMonth(dateObj) {
    let date = new Date(dateObj.epoch);
    date.setDate(date.getDate() + 1);
    this.selectedMonth = this.config.monthsList[date.getMonth()];
    this.selectedYear = date.getFullYear();
    this.loadDaysList(new Date(date));
  }

  setDate() {
    console.log(this.selectedDate);
    this.dismiss();
  }

  setToday() {
    this.loadDaysList(this.today);
    this.selectedMonth = this.config.monthsList[this.today.getMonth()];
    this.selectedYear = this.today.getFullYear();
    this.selectedDate = this.resetHMSM(new Date());
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}