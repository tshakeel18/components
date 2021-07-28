import {trigger, transition, animate, style} from '@angular/animations';

export const showHide = trigger('showHide', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('0.2s ease-out', style({ transform: 'translateY(0)' })),
  ]),
  transition(':leave', [animate('0.2s ease-out', style({ transform: 'translateY(100%)' }))]),
]);
