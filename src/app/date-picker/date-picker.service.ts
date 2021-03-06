import {Injectable, EventEmitter} from '@angular/core';
import {IDatePickerConfig} from './date-picker-config.model';
import * as moment from 'jalali-moment';
import {Moment, unitOfTime} from 'jalali-moment';
import {UtilsService} from '../common/services/utils/utils.service';
import {FormControl} from '@angular/forms';
import {IDayCalendarConfig} from '../day-calendar/day-calendar-config.model';
import {IDate} from '../common/models/date.model';
import {ECalendarSystem} from '../common/types/calendar-type-enum';

@Injectable()
export class DatePickerService {
  readonly onPickerClosed: EventEmitter<null> = new EventEmitter();
  private defaultConfig: IDatePickerConfig = {
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    format: 'DD-MM-YYYY',
    onOpenDelay: 0,
    disableKeypress: false,
    showNearMonthDays: true,
    drops: 'down',
    opens: 'right',
    showWeekNumbers: false,
    enableMonthSelector: true,
    showGoToCurrent: true
  };

  constructor(private utilsService: UtilsService) {
  }

  // todo:: add unit tests
  getConfig(config: IDatePickerConfig): IDatePickerConfig {

    this.defaultConfig.format = (!config || (config.calendarSystem !== ECalendarSystem.gregorian)) ? 'jYYYY-jM-jD' : 'DD-MM-YYYY';

    const _config: IDatePickerConfig = {...this.defaultConfig, ...this.utilsService.clearUndefined(config)};
    const {min, max, format} = _config;
    if (min) {
      _config.min = this.utilsService.convertToMoment(min, format);
    }

    if (max) {
      _config.max = this.utilsService.convertToMoment(max, format);
    }

    if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
      _config.closeOnSelect = false;
    }

    return _config;
  }

  getDayConfigService(pickerConfig: IDatePickerConfig): IDayCalendarConfig {
    return {
      min: pickerConfig.min,
      max: pickerConfig.max,
      isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
      weekdayNames: pickerConfig.weekdayNames,
      showNearMonthDays: pickerConfig.showNearMonthDays,
      showWeekNumbers: pickerConfig.showWeekNumbers,
      firstDayOfWeek: pickerConfig.firstDayOfWeek,
      format: pickerConfig.format,
      calendarSystem: pickerConfig.calendarSystem,
      allowMultiSelect: pickerConfig.allowMultiSelect,
      monthFormat: pickerConfig.monthFormat,
      monthFormatter: pickerConfig.monthFormatter,
      enableMonthSelector: pickerConfig.enableMonthSelector,
      yearFormat: pickerConfig.yearFormat,
      yearFormatter: pickerConfig.yearFormatter,
      dayBtnFormat: pickerConfig.dayBtnFormat,
      dayBtnFormatter: pickerConfig.dayBtnFormatter,
      monthBtnFormat: pickerConfig.monthBtnFormat,
      monthBtnFormatter: pickerConfig.monthBtnFormatter
    };
  }

  pickerClosed() {
    this.onPickerClosed.emit();
  }

  // todo:: add unit tests
  isValidInputDateValue(value: string, config: IDatePickerConfig): boolean {
    value = value ? value : '';
    let datesStrArr: string[];

    if (config.allowMultiSelect) {
      datesStrArr = value.split(',');
    } else {
      datesStrArr = [value];
    }

    return datesStrArr.every(date => this.utilsService.isDateValid(date, config.format));
  }

  // todo:: add unit tests
  convertInputValueToMomentArray(value: string, config: IDatePickerConfig): Moment[] {
    value = value ? value : '';
    let datesStrArr: string[];

    if (config.allowMultiSelect) {
      datesStrArr = value.split(',');
    } else {
      datesStrArr = [value];
    }

    return this.utilsService.convertToMomentArray(datesStrArr, config.format, config.allowMultiSelect);
  }
}
