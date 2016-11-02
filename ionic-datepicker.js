"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var IonicDatepicker = (function () {
    function IonicDatepicker(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.selectedDate = new Date();
        this.weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.years = this.getYearsList();
        this.rows = [0, 7, 14, 21, 28, 35];
        this.cols = [0, 1, 2, 3, 4, 5, 6];
        this.config = this.params.data.datepickerConfig || {};
        this.config.fromDate = this.config.fromDate ? this.resetHMSM(new Date(this.config.fromDate)) : null;
        this.config.toDate = this.config.toDate ? this.resetHMSM(new Date(this.config.toDate)) : null;
        this.config.disabledDates = this.config.disabledDates ? this.prepareDisabledDates(this.config.disabledDates) : [];
        this.today = this.resetHMSM(new Date());
        var currentDate = new Date();
        this.selectedMonth = this.months[currentDate.getMonth()];
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
        this.selectedDate.setMonth(this.months.indexOf(this.selectedMonth));
        this.selectedDate.setYear(this.selectedYear);
        this.loadDaysList(new Date(this.selectedDate));
    };
    IonicDatepicker.prototype.yearSelected = function (event, selectedYear) {
        this.selectedYear = selectedYear;
        this.selectedDate.setMonth(this.months.indexOf(this.selectedMonth));
        this.selectedDate.setYear(this.selectedYear);
        this.loadDaysList(new Date(this.selectedDate));
    };
    IonicDatepicker.prototype.dateClicked = function (dateObj) {
        this.selectedDate = new Date(dateObj.epoch);
    };
    IonicDatepicker.prototype.prevMonth = function (dateObj) {
        var date = new Date(dateObj.epoch);
        date.setDate(date.getDate() - dateObj.date);
        this.selectedMonth = this.months[date.getMonth()];
        this.selectedYear = date.getFullYear();
        this.loadDaysList(new Date(date));
    };
    IonicDatepicker.prototype.nextMonth = function (dateObj) {
        var date = new Date(dateObj.epoch);
        date.setDate(date.getDate() + 1);
        this.selectedMonth = this.months[date.getMonth()];
        this.selectedYear = date.getFullYear();
        this.loadDaysList(new Date(date));
    };
    IonicDatepicker.prototype.setDate = function () {
        this.dismiss();
    };
    IonicDatepicker.prototype.setToday = function () {
        this.loadDaysList(this.today);
        this.selectedMonth = this.months[this.today.getMonth()];
        this.selectedYear = this.today.getFullYear();
    };
    IonicDatepicker.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    IonicDatepicker = __decorate([
        core_1.Component({
            templateUrl: 'ionic-datepicker.html'
        })
    ], IonicDatepicker);
    return IonicDatepicker;
}());
exports.IonicDatepicker = IonicDatepicker;
