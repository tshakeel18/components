import {InjectionToken} from '@angular/core';

import {AvatarOptions} from './avatar.options';

export const AVATAR_CONFIG = new InjectionToken<AvatarOptions>('avatar.config');
