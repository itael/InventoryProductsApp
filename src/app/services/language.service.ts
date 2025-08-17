import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'es';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  public readonly languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
      if (savedLanguage && this.isValidLanguage(savedLanguage)) {
        this.currentLanguageSubject.next(savedLanguage);
      } else {
        // Detect browser language
        const browserLang = navigator.language.substring(0, 2) as Language;
        const defaultLang = this.isValidLanguage(browserLang) ? browserLang : 'en';
        this.setLanguage(defaultLang);
      }
    }
  }

  setLanguage(language: Language): void {
    if (this.isValidLanguage(language)) {
      this.currentLanguageSubject.next(language);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('selectedLanguage', language);
      }
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  getLanguageOption(code: Language): LanguageOption | undefined {
    return this.languages.find(lang => lang.code === code);
  }

  private isValidLanguage(code: string): code is Language {
    return code === 'en' || code === 'es';
  }
}
