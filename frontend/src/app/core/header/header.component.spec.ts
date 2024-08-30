import {ComponentFixture, TestBed} from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {RouterModule} from "@angular/router";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {anyString, instance, mock, verify, when} from "@johanblumenberg/ts-mockito";
import {getTranslocoModule} from "../../shared/testing/transloco-testing.module";
import {TestHelper} from "../../shared/testing/test-helper";
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('HeaderComponent', (): void => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    localStorageService = mock(LocalStorageService);

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        getTranslocoModule()
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: LocalStorageService, useValue: instance(localStorageService) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();

    component = fixture.componentInstance;
  });

  describe('TypeScript', (): void => {
    it('should initialize languages array correctly', (): void => {
      // GIVEN
      const expectedLanguages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
      ];

      // THEN
      expect(component.languages).toEqual(expectedLanguages);
    });

    it('should set language from localStorage if available', (): void => {
      // GIVEN
      when(localStorageService.getData(anyString())).thenReturn('fr');

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.currentLanguage).toEqual({ code: 'fr', name: 'Français', flag: '🇫🇷' });
    });

    it('should set language from TranslocoService if not in localStorage', (): void => {
      // GIVEN
      when(localStorageService.getData(anyString())).thenReturn(null);

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.currentLanguage).toEqual({ code: 'en', name: 'English', flag: '🇬🇧' });
    });

    it('changeLanguage should update currentLanguage is known, set active lang, and save to localStorage', (): void => {
      // GIVEN
      const newLang = 'fr';

      // WHEN
      component.changeLanguage(newLang);

      // THEN
      expect(component.currentLanguage).toEqual({ code: 'fr', name: 'Français', flag: '🇫🇷' });
      verify(localStorageService.saveData('selected_lang', newLang)).once();
    });

    it('changeLanguage should update currentLanguage if value is unknown, set active lang, and save to localStorage', (): void => {
      // GIVEN
      const newLang = 'es';

      // WHEN
      component.changeLanguage(newLang);

      // THEN
      expect(component.currentLanguage).toEqual({ code: 'en', name: 'English', flag: '🇬🇧' });
      verify(localStorageService.saveData('selected_lang', newLang)).once();
    });
  });

  describe('Template', (): void => {
    it('should display the current default language', (): void => {
      // GIVEN
      const expectedTranslations = ['Dashboard', 'Login', 'Register'];

      // WHEN
      fixture.detectChanges();

      // THEN
      const buttonTexts = [
        TestHelper.getTextContentByDataTest(fixture, 'btn-dashboard'),
        TestHelper.getTextContentByDataTest(fixture, 'btn-login'),
        TestHelper.getTextContentByDataTest(fixture, 'btn-register')
      ];
      expect(buttonTexts).toEqual(expectedTranslations);
      expect(TestHelper.getTextContentById(fixture, 'languageDropdown')).toBe('🇬🇧');
    });

    it('should display the updated language from english to french', (): void => {
      // GIVEN
      const expectedTranslations = ['Tableau de bord', 'Connexion', "S'inscrire"];

      // WHEN
      TestHelper.clickOnElementById(fixture, 'languageDropdown');
      TestHelper.clickOnElementByDataTest(fixture, 'dropdown-item-fr');
      fixture.detectChanges();

      // THEN
      const buttonTexts = [
        TestHelper.getTextContentByDataTest(fixture, 'btn-dashboard'),
        TestHelper.getTextContentByDataTest(fixture, 'btn-login'),
        TestHelper.getTextContentByDataTest(fixture, 'btn-register')
      ];
      expect(buttonTexts).toEqual(expectedTranslations);
      expect(TestHelper.getTextContentById(fixture, 'languageDropdown')).toBe('🇫🇷'); // language icon
    });

    it('should render correct language options', (): void => {
      // WHEN
      fixture.detectChanges();

      // THEN
      const languageItems = TestHelper.getTextContentsBySelector(fixture, '.dropdown-item');
      component.languages.forEach((lang, index) => {
        expect(languageItems[index]).toContain(`${lang.flag} ${lang.name}`);
      });
      expect(languageItems.length).toBe(2);
    });

    it('should call changeLanguage when a language option is clicked', (): void => {
      // GIVEN
      const changeLanguageSpy = spyOn(component, 'changeLanguage');
      fixture.detectChanges();

      // WHEN
      const frenchOption = TestHelper.getElementsBySelector(fixture, '.dropdown-item')[1];
      frenchOption.click();

      // THEN
      expect(changeLanguageSpy).toHaveBeenCalledWith('fr');
    });

    it('should have correct route links', (): void => {
      // GIVEN
      const expectedRoutes = ['/', '/dashboard', '/auth/login', '/auth/register'];

      // WHEN
      component.ngOnInit();

      // THEN
      const routerLinks = TestHelper.getAttributesBySelector(fixture, '[routerLink]');
      routerLinks.forEach((attributes, index) => {
        expect(attributes.getNamedItem('routerLink')?.value).toBe(expectedRoutes[index]);
      });
    });
  });
});
