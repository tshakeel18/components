import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AvatarComponent} from './avatar.component';
import {AVATAR_CONFIG} from './avatar.config';
import {AvatarOptions} from './avatar.options';

const DEFAULT_OPTIONS = new AvatarOptions();

@NgModule({
  declarations: [AvatarComponent],
  exports:      [AvatarComponent],
  imports:      [CommonModule, BrowserAnimationsModule]
})
export class AvatarModule {
  public static forRoot(defaultOptions = DEFAULT_OPTIONS): ModuleWithProviders<AvatarModule> {
    return {
      ngModule:  AvatarModule,
      providers: [
        {
          provide:  AVATAR_CONFIG,
          useValue: defaultOptions
        }
      ]
    };
  }
}
