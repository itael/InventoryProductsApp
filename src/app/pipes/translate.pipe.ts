import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private languageSubscription?: Subscription;
  private currentLanguage?: string;

  constructor(
    private translationService: TranslationService,
    private languageService: LanguageService
  ) {
    // Subscribe to language changes to trigger pipe updates
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  transform(key: string, params?: { [key: string]: string }): string {
    if (!key) return '';
    
    // Get current language to make pipe reactive
    const currentLang = this.languageService.getCurrentLanguage();
    
    // Use sync method with parameters for immediate result
    if (params) {
      return this.translationService.translateSyncWithParams(key, params);
    } else {
      return this.translationService.translateSync(key);
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}
