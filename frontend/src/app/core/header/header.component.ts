import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import packageInfo  from '../../../../package.json'
import {UtilService} from "../../shared/services/util.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];
  currentLanguage: { code: string; flag: string; name: string } = this.languages[0];
  appName = UtilService.toCapitalize(packageInfo.name);

  constructor(private translocoService: TranslocoService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    const savedLang = this.localStorageService.getData('selected_lang');
    if (savedLang) {
      this.setCurrentLanguage(savedLang);
      this.translocoService.setActiveLang(savedLang);
    } else {
      this.setCurrentLanguage(this.translocoService.getActiveLang());
    }
  }

  changeLanguage(langCode: string) {
    this.translocoService.setActiveLang(langCode);
    this.setCurrentLanguage(langCode);
    this.localStorageService.saveData('selected_lang', langCode);
  }

  private setCurrentLanguage(value: string): void {
    this.currentLanguage = this.languages.find(lang => lang.code === value) ?? this.languages[0];
  }
}
