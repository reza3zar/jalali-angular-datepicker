import {TestBed, inject} from '@angular/core/testing';
import {DatePickerDirectiveService} from './date-picker-directive.service';
import {UtilsService} from '../common/services/utils/utils.service';
import {ECalendarSystem} from '../common/types/calendar-type-enum';

describe('Service: DatePickerDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePickerDirectiveService, UtilsService]
    });
  });

  it('should check convertToElement method', inject([DatePickerDirectiveService, UtilsService],
    (service: DatePickerDirectiveService, stubUtilsService: UtilsService) => {
      stubUtilsService.closestParent = jasmine.createSpy('closestParent').and.returnValue('fakeElement');

      const baseElement = <any>{};
      const element1 = service.convertToHTMLElement({nativeElement: 'fakeElement'}, baseElement);
      expect(element1).toBe('fakeElement');
      expect(stubUtilsService.closestParent).not.toHaveBeenCalled();

      const element2 = service.convertToHTMLElement('.notFound', baseElement);
      expect(element2).toBe('fakeElement');
      expect(stubUtilsService.closestParent).toHaveBeenCalledWith(baseElement, '.notFound');
    }));

  it('should check getConfig method', inject([DatePickerDirectiveService],
    (service: DatePickerDirectiveService) => {
      service.convertToHTMLElement = jasmine.createSpy('convertToHTMLElement').and.returnValue('fakeElement');

      const config1 = service.getConfig();
      expect(config1).toEqual({hideInputContainer: true});
      expect(service.convertToHTMLElement).not.toHaveBeenCalled();

      const config2 = service.getConfig({allowMultiSelect: true, calendarSystem : ECalendarSystem.gregorian});
      expect(config2).toEqual({
        allowMultiSelect: true,
        hideInputContainer: true,
        calendarSystem : ECalendarSystem.gregorian
      });
      expect(service.convertToHTMLElement).not.toHaveBeenCalled();

      const fakeElement = {};
      const config3 = service.getConfig(
        {allowMultiSelect: true, calendarSystem : ECalendarSystem.gregorian},
        { nativeElement: fakeElement }
      );
      expect(config3).toEqual({
        allowMultiSelect: true,
        hideInputContainer: true,
        inputElementContainer: fakeElement,
        calendarSystem : ECalendarSystem.gregorian
      });
      expect(service.convertToHTMLElement).not.toHaveBeenCalled();

      const fakeAttachElementRef = { nativeElement: {} };
      const fakeElementRef = { nativeElement: fakeElement };
      const config4 = service.getConfig(
        {allowMultiSelect: true, calendarSystem : ECalendarSystem.gregorian},
        fakeElementRef,
        fakeAttachElementRef
      );
      expect(config4).toEqual({
        allowMultiSelect: true,
        hideInputContainer: true,
        inputElementContainer: 'fakeElement',
        calendarSystem : ECalendarSystem.gregorian
      });
      expect(service.convertToHTMLElement).toHaveBeenCalledWith(fakeAttachElementRef, fakeElement);

      const config5 = service.getConfig(
        {allowMultiSelect: true, calendarSystem : ECalendarSystem.gregorian},
        fakeElementRef,
        'someSelector'
      );
      expect(config5).toEqual({
        allowMultiSelect: true,
        hideInputContainer: true,
        inputElementContainer: 'fakeElement',
        calendarSystem : ECalendarSystem.gregorian
      });
      expect(service.convertToHTMLElement).toHaveBeenCalledWith('someSelector', fakeElement);
    }));
});
