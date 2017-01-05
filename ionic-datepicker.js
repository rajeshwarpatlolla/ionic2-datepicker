"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var IonicDatepicker = (function () {
    function IonicDatepicker(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.selectedDate = new Date();
        var weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        var currentDate = this.resetHMSM(new Date(this.config.inputDate));
        this.selectedMonth = this.config.monthsList[currentDate.getMonth()];
        this.selectedYear = currentDate.getFullYear();
        this.loadDaysList(currentDate);
    }
    IonicDatepicker.prototype.prepareDisabledDates = function (disbaledDates) {
        var _this = this;
        disbaledDates.forEach(function (disbaledDate, i) {
            disbaledDates[i] = _this.resetHMSM(new Date(disbaledDate)).getTime();
        });
        return disbaledDates;
    };
    IonicDatepicker.prototype.resetHMSM = function (currentDate) {
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        return currentDate;
    };
    IonicDatepicker.prototype.getYearsList = function () {
        var yearsList = [];
        for (var year = 1900; year <= 2100; year++) {
            yearsList.push(year);
        }
        return yearsList;
    };
    IonicDatepicker.prototype.loadDaysList = function (ipDate) {
        this.daysList = [];
        var firstDay = new Date(ipDate.getFullYear(), ipDate.getMonth(), 1).getDate();
        var lastDay = new Date(ipDate.getFullYear(), ipDate.getMonth() + 1, 0).getDate();
        for (var i = firstDay; i <= lastDay; i++) {
            var tempDate = new Date(ipDate.getFullYear(), ipDate.getMonth(), i);
            if (i === firstDay) {
                this.prevDisabled = tempDate.getTime() < this.config.fromDate.getTime();
            }
            if (i === lastDay) {
                this.nextDisabled = tempDate.getTime() > this.config.toDate.getTime();
            }
            var isEnabled = ((this.config.fromDate && this.config.toDate) ? (this.config.fromDate.getTime() <= tempDate.getTime() && this.config.toDate.getTime() >= tempDate.getTime()) : ((this.config.fromDate && !this.config.toDate) ? (this.config.fromDate.getTime() <= tempDate.getTime()) : this.config.toDate.getTime() >= tempDate.getTime())) && (this.config.disabledDates.indexOf(tempDate.getTime()) < 0);
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
        for (var j = 0; j < firstDay; j++) {
            this.daysList.unshift({});
        }
    };
    IonicDatepicker.prototype.monthSelected = function (event, selectedMonth) {
        this.selectedMonth = selectedMonth;
        this.selectedDate.setMonth(this.config.monthsList.indexOf(this.selectedMonth));
        this.selectedDate.setYear(this.selectedYear);
        this.loadDaysList(new Date(this.selectedDate));
    };
    IonicDatepicker.prototype.yearSelected = function (event, selectedYear) {
        this.selectedYear = selectedYear;
        this.selectedDate.setMonth(this.config.monthsList.indexOf(this.selectedMonth));
        this.selectedDate.setYear(this.selectedYear);
        this.loadDaysList(new Date(this.selectedDate));
    };
    IonicDatepicker.prototype.dateClicked = function (dateObj) {
        this.selectedDate = new Date(dateObj.epoch);
    };
    IonicDatepicker.prototype.prevMonth = function (dateObj) {
        var date = new Date(dateObj.epoch);
        date.setDate(date.getDate() - dateObj.date);
        this.selectedMonth = this.config.monthsList[date.getMonth()];
        this.selectedYear = date.getFullYear();
        this.loadDaysList(new Date(date));
    };
    IonicDatepicker.prototype.nextMonth = function (dateObj) {
        var date = new Date(dateObj.epoch);
        date.setDate(date.getDate() + 1);
        this.selectedMonth = this.config.monthsList[date.getMonth()];
        this.selectedYear = date.getFullYear();
        this.loadDaysList(new Date(date));
    };
    IonicDatepicker.prototype.setDate = function () {
        console.log(this.selectedDate);
        this.dismiss();
    };
    IonicDatepicker.prototype.setToday = function () {
        this.loadDaysList(this.today);
        this.selectedMonth = this.config.monthsList[this.today.getMonth()];
        this.selectedYear = this.today.getFullYear();
        this.selectedDate = this.resetHMSM(new Date());
    };
    IonicDatepicker.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return IonicDatepicker;
}());
IonicDatepicker = __decorate([
    core_1.Component({
        styles: [
            "\n    .ionic_datepicker_modal_content {\n      ion-row {\n        padding: 4px;\n      }\n      ion-col {\n        text-align: center;\n        margin: auto;\n      }\n      .font_bold {\n        font-weight: bold;\n      } \n      .label-md{\n        display: none;\n      }\n      ion-select{\n        max-width: 100%;\n        width: 100%;\n      }\n      .select-md {\n        padding: 5px;\n      }\n      .date_cell{\n        padding: 5px;\n      }\n      .disabled{\n        pointer-events: none;\n        color: #aaa;\n      }\n      .today{\n        border: 1px solid #387ef5;\n        border-radius: 2px;\n        color: #000;\n      }\n      .selected_date{\n        color: #fff;\n        font-weight: bold;\n        border-radius: 2px;\n        background-color: #387ef5;\n      }\n    }\n\n  "
        ],
        template: "\n    <ion-header>\n      <ion-toolbar>\n        <ion-title>\n          <!-- <span [innerHTML]=\"selectedDate\"></span> -->\n          {{ selectedDate | date: config.dateFormat }}\n        </ion-title>\n      </ion-toolbar>\n    </ion-header>\n\n    <ion-content class=\"ionic_datepicker_modal_content\">\n      <ion-list>\n        <ion-grid>\n          <ion-row class=\"center\">\n            <ion-col width-10 (click)=\"prevMonth(daysList[daysList.length - 1])\" [ngClass]=\"{disabled: (prevDisabled)}\">\n              <ion-icon ios=\"ios-arrow-back\" md=\"md-arrow-back\"></ion-icon>\n            </ion-col>\n            <ion-col width-80>\n              <!--<span [innerHTML]=\"months[daysList[daysList.length - 1].month]\"></span>\n              <span> - </span>\n              <span [innerHTML]=\"daysList[daysList.length - 1].year\"></span>-->\n              <ion-row class=\"center\">\n                <ion-col width-50>\n                  <ion-item>\n                    <ion-label>Month</ion-label>\n                    <ion-select [(ngModel)]=\"selectedMonth\" (ionChange)=\"monthSelected($event,selectedMonth)\">\n                      <ion-option [value]=\"month\" *ngFor=\"let month of config.monthsList\" [innerHTML]=\"month\"></ion-option>\n                    </ion-select>\n                  </ion-item>\n                </ion-col>\n                <ion-col width-50>\n                  <ion-item>\n                    <ion-label>Year</ion-label>\n                    <ion-select [(ngModel)]=\"selectedYear\" (ionChange)=\"yearSelected($event,selectedYear)\">\n                      <ion-option [value]=\"year\" *ngFor=\"let year of years\" [innerHTML]=\"year\"></ion-option>\n                    </ion-select>\n                  </ion-item>\n                </ion-col>\n              </ion-row>\n            </ion-col>\n            <ion-col width-10 (click)=\"nextMonth(daysList[daysList.length - 1])\" [ngClass]=\"{disabled: (nextDisabled)}\">\n              <ion-icon ios=\"ios-arrow-forward\" md=\"md-arrow-forward\"></ion-icon>\n            </ion-col>\n          </ion-row>\n          <ion-row class=\"center\">\n            <ion-col width-10 *ngFor=\"let week of config.weeksList\" [innerHTML]=\"week\" class=\"font_bold\"></ion-col>\n          </ion-row>\n          <ion-row class=\"center\" *ngFor=\"let row of rows\">\n            <ion-col width-10 *ngFor=\"let col of cols\">\n              <span *ngIf=\"daysList[row + col]\" class=\"date_cell\" [innerHTML]=\"daysList[row + col].date\" (click)=\"dateClicked(daysList[row + col])\" [ngClass]=\"{today: (today.getTime() == daysList[row + col].epoch), selected_date: (selectedDate.getTime() == daysList[row + col].epoch), disabled: (!daysList[row + col].enabled)}\"></span>\n            </ion-col>\n          </ion-row>\n        </ion-grid>\n      </ion-list>\n    </ion-content>\n    <ion-footer>\n      <ion-toolbar>\n        <ion-buttons start (click)=\"setDate()\">\n          <button ion-button color=\"royal\" [innerHTML]=\"config.setLabel\"></button>\n        </ion-buttons>\n        <ion-buttons center (click)=\"setToday()\">\n          <button ion-button color=\"royal\" [innerHTML]=\"config.todayLabel\"></button>\n        </ion-buttons>\n        <ion-buttons end (click)=\"dismiss()\">\n          <button ion-button color=\"royal\" [innerHTML]=\"config.closeLabel\"></button>\n        </ion-buttons>\n      </ion-toolbar>\n    </ion-footer>\n  "
    })
], IonicDatepicker);
exports.IonicDatepicker = IonicDatepicker;