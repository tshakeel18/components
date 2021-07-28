import {
  animate,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger
} from '@angular/animations';

/**
 * Height transition
 * Transitions height from undefined value to 0
 * when component enters from void state to any state
 * Transitions height from 0 to undefined state
 * when component enters from any state to void state
 * void => component does not exist in dom
 */
export const expandCollapse: AnimationTriggerMetadata = trigger('expandedState', [
  transition('void => *', [
    style({
      opacity: 0,
      height: 0
    }),
    animate('.2s ease-out')
  ]),
  transition('* => void', [
    style({ height: '*' }),
    animate('.2s ease-in', style({
      opacity: 0,
      height: 0
    }))
  ])
]);
