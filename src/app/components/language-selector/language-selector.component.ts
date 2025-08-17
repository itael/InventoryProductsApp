import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService, Language, LanguageOption } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <button 
        class="language-toggle"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isDropdownOpen"
        aria-label="Select Language">
        <span class="current-language">
          <span class="flag">{{ currentLanguageOption?.flag }}</span>
          <span class="name">{{ currentLanguageOption?.name }}</span>
        </span>
        <i class="arrow" [class.open]="isDropdownOpen">▼</i>
      </button>
      
      <div 
        class="language-dropdown"
        [class.show]="isDropdownOpen"
        (click)="closeDropdown()">
        <div class="language-option" 
             *ngFor="let language of availableLanguages"
             [class.active]="language.code === currentLanguage"
             (click)="selectLanguage(language.code); $event.stopPropagation()">
          <span class="flag">{{ language.flag }}</span>
          <span class="name">{{ language.name }}</span>
          <i class="check" *ngIf="language.code === currentLanguage">✓</i>
        </div>
      </div>
    </div>

    <!-- Backdrop for mobile -->
    <div 
      class="language-backdrop"
      [class.show]="isDropdownOpen"
      (click)="closeDropdown()">
    </div>
  `,
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  currentLanguage: Language = 'en';
  currentLanguageOption: LanguageOption | undefined;
  availableLanguages: LanguageOption[] = [];
  isDropdownOpen = false;

  private destroy$ = new Subject<void>();

  constructor(private languageService: LanguageService) {
    this.availableLanguages = this.languageService.languages;
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this.currentLanguage = language;
        this.currentLanguageOption = this.languageService.getLanguageOption(language);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  selectLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.closeDropdown();
  }
}
