import debounce from '../../common/decorators/decorators';
import {IDatePickerConfig} from '../../date-picker/date-picker-config.model';
import {DatePickerComponent} from '../../date-picker/date-picker.component';
import {DatePickerDirective} from '../../date-picker/date-picker.directive';
import {Component, HostListener, ViewChild} from '@angular/core';
import { FormControl, NgForm, FormGroup, Validators, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'jalali-moment';
import {Moment} from 'jalali-moment';
import {ECalendarSystem} from '../../common/types/calendar-type-enum';

@Component({
  selector: 'dp-demo',
  templateUrl: './demo.component.html',
  entryComponents: [DatePickerComponent],
  styleUrls: ['./demo.component.less']
})
export class DemoComponent {
  @ViewChild('datePicker') datePicker: DatePickerComponent;
  @ViewChild('dateDirectivePicker') dateDirectivePicker: DatePickerDirective;
  demoFormat = 'DD-MM-YYYY';
  readonly DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  pickerMode = 'dayPicker';

  direction: string = 'ltr';
  date: Moment;
  dates: Moment[] = [];
  material: boolean = true;
  required: boolean = false;
  disabled: boolean = false;
  validationMinDate: Moment;
  validationMaxDate: Moment;
  placeholder: string = 'Choose a date...';

  formGroup: FormGroup = new FormGroup({
    datePicker: new FormControl({ value: this.date, disabled: this.disabled }, [
      this.required ? Validators.required : () => undefined,
      control => this.validationMinDate && this.config && moment(control.value, this.config.format).isBefore(this.validationMinDate)
        ? {minDate: 'minDate Invalid'} : undefined,
      control => this.validationMaxDate && this.config && moment(control.value, this.config.format).isAfter(this.validationMaxDate)
        ? {maxDate: 'maxDate Invalid'} : undefined,
    ]),
  });

  jalaliSystemDefaults: IDatePickerConfig = {
    firstDayOfWeek: 'sa',
    format: 'jYYYY/jM/jD',
    monthFormat: 'jMMMM jYY',
    disableKeypress: false,
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    onOpenDelay: 0,
    weekdayNames: {
      su: 'ی',
      mo: 'د',
      tu: 'س',
      we: 'چ',
      th: 'پ',
      fr: 'ج',
      sa: 'ش'
    },
    appendTo: document.body,
    drops: 'down',
    opens: 'right',
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    yearFormat: 'jYYYY',
    showGoToCurrent: true,
    calendarSystem: ECalendarSystem.jalali,
    dayBtnFormat: 'jD',
    monthBtnFormat: 'jMMMM'
  };
  gregorianSystemDefaults: IDatePickerConfig = {
    firstDayOfWeek: 'su',
    format: 'DD-MM-YYYY',
    monthFormat: 'MMM, YYYY',
    disableKeypress: false,
    allowMultiSelect: false,
    closeOnSelect: undefined,
    closeOnSelectDelay: 100,
    onOpenDelay: 0,
    weekdayNames: {
      su: 'sun',
      mo: 'mon',
      tu: 'tue',
      we: 'wed',
      th: 'thu',
      fr: 'fri',
      sa: 'sat'
    },
    appendTo: document.body,
    drops: 'down',
    opens: 'right',
    showNearMonthDays: true,
    showWeekNumbers: false,
    enableMonthSelector: true,
    yearFormat: 'YYYY',
    showGoToCurrent: true,
    calendarSystem: ECalendarSystem.gregorian,
    dayBtnFormat: 'DD',
    monthBtnFormat: 'MMM'
  };
  config: IDatePickerConfig = {...this.jalaliSystemDefaults};
  isAtTop: boolean = true;

  @HostListener('document:scroll')
  @debounce(100)
  updateIsAtTop() {
    this.isAtTop = document.body.scrollTop === 0;
  }

  changeCalendarSystem() {
    const defaultCalSys = (this.config.calendarSystem === ECalendarSystem.jalali) ?
      this.jalaliSystemDefaults : this.gregorianSystemDefaults;
    this.date = moment();
    this.config = {...this.config, ...defaultCalSys};
  }

  modeChanged() {
    this.config.hideInputContainer = false;
    this.config.inputElementContainer = undefined;
    this.formGroup.get('datePicker').setValue(this.date);
  }

  validatorsChanged() {
    this.formGroup.get('datePicker').updateValueAndValidity();
  }

  configChanged() {
    this.config = {...this.config};
  };


  openCalendar() {
    (this.datePicker || this.dateDirectivePicker).api.open();
  }

  closeCalendar() {
    (this.datePicker || this.dateDirectivePicker).api.close();
  }

  log(item) {
    console.log(item);
  }
}
