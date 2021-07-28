import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Inject, Input, OnInit, Optional, Output} from '@angular/core';

import {AVATAR_CONFIG} from './avatar.config';
import {AvatarOptions} from './avatar.options';
import {showHide} from './show-hide.animation';

@Component({
  animations:      [showHide],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector:        'ws-avatar',
  styleUrls:       ['./avatar.component.scss'],
  templateUrl:     './avatar.component.html'
})
export class AvatarComponent implements OnInit {
  @Input() public editable      = true;
  @Input() public image: string | undefined;
  public options: AvatarOptions = new AvatarOptions();
  public show                   = false;
  @Input() public size: number | undefined;
  @Output() public update       = new EventEmitter<null>();

  constructor(@Optional() @Inject(AVATAR_CONFIG) protected config: AvatarOptions) {
  }

  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  private get circleSize(): number | undefined {
    return this.options.size;
  }

  public ngOnInit(): void {
    this.setOptions();
  }

  public onUpdate(): void {
    this.update.emit();
  }

  public setVisibility(value: boolean): void {
    this.show = value;
  }

  private setOptions(): void {
    this.options = Object.assign(
      {},
      {...JSON.parse(JSON.stringify(this.options))},
      {...JSON.parse(JSON.stringify(this.config))},
      {
        ...JSON.parse(JSON.stringify({
          size:  this.size,
          image: this.image
        }))
      }
    );
  }
}
