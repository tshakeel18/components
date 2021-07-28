import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {AvatarComponent} from './avatar.component';
import {AvatarModule} from './avatar.module';
import {AvatarOptions} from './avatar.options';

const AVATAR_IMAGE = 'https://gravatar.com/avatar/43f4252af7680bbd7937ed2e4a48329b?s=400&d=robohash&r=x';

function triggerEvents(el: HTMLElement, type: string, selector: string): void {
  const container: HTMLElement = el.querySelector(selector) as HTMLElement;
  container.dispatchEvent(new Event(type));
}

describe('AvatarComponent', () => {
  describe((
    'Default Settings'
  ), async () => {
    let component: DefaultAvatarComponent;
    let fixture: ComponentFixture<DefaultAvatarComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
          imports:      [AvatarModule.forRoot()],
          declarations: [DefaultAvatarComponent],
          schemas:      [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    });

    beforeEach(async () => {
      fixture   = TestBed.createComponent(DefaultAvatarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('shaould render component', async () => {
      expect(component).toBeTruthy();
    });

    it('should contain default options', async () => {
      const options             = new AvatarOptions();
      const el: AvatarComponent = fixture.debugElement.query(
        By.directive(AvatarComponent)).componentInstance;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(el.options.image).toEqual(options.image);
        expect(el.options.size).toEqual(options.size);
      });
    });

    it('should enable editing', async () => {
      component.editable = true;
      fixture.detectChanges();
      const el: AvatarComponent = fixture.debugElement.query(
        By.directive(AvatarComponent)).componentInstance;
      expect(el.editable).toBeTruthy();
    });

    it('should show update button on mouseover', async () => {
      const el = fixture.debugElement.query(
        By.directive(AvatarComponent));
      triggerEvents(el.nativeElement, 'mouseenter', '.avatar');
      fixture.detectChanges();
      const instance: AvatarComponent = el.componentInstance;
      expect(instance.show).toBeTruthy();
    });

    it('should trigger update event', async () => {
      component.editable = true;
      fixture.detectChanges();
      const el = fixture.debugElement.query(
        By.directive(AvatarComponent));
      triggerEvents(el.nativeElement, 'mouseenter', '.avatar');
      fixture.detectChanges();
      const instance: AvatarComponent = el.componentInstance;
      spyOn(instance, 'onUpdate').and.callThrough();

      triggerEvents(el.nativeElement, 'click', 'button');
      fixture.detectChanges();
      expect(instance.onUpdate).toHaveBeenCalled();
    });

    it('should hide update button on mouseleave', async () => {
      const el = fixture.debugElement.query(
        By.directive(AvatarComponent));
      triggerEvents(el.nativeElement, 'mouseleave', '.avatar');
      fixture.detectChanges();
      const instance: AvatarComponent = el.componentInstance;
      expect(instance.show).toBeFalsy();
    });
  });

  describe((
    'With Input'
  ), () => {
    let component: AvatarWithInputComponent;
    let fixture: ComponentFixture<AvatarWithInputComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
          imports:      [AvatarModule.forRoot()],
          declarations: [AvatarWithInputComponent],
          schemas:      [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    });

    afterEach(() => {
      fixture.destroy();
    });

    beforeEach(async () => {
      fixture   = TestBed.createComponent(AvatarWithInputComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should use input values', async () => {
      const el = fixture.debugElement.query(
        By.directive(AvatarComponent)).componentInstance;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(el.size).toBe(component.size);
        expect(el.image).toBe(component.imageUrl);
      });
    });
  });

  describe((
    'Input overriding root config'
  ), () => {
    let component: AvatarWithInputComponent;
    let fixture: ComponentFixture<AvatarWithInputComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
          imports:      [AvatarModule.forRoot({size: 70})],
          declarations: [AvatarWithInputComponent],
          schemas:      [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    });

    afterEach(() => {
      fixture.destroy();
    });

    beforeEach(async () => {
      fixture   = TestBed.createComponent(AvatarWithInputComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should use input size instead of root config value', async () => {
      const el = fixture.debugElement.query(
        By.directive(AvatarComponent)).componentInstance;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(el.size).toBe(component.size);
      });
    });
  });

  describe((
    'Root Config'
  ), () => {
    let component: AvatarWithRootConfigComponent;
    let fixture: ComponentFixture<AvatarWithRootConfigComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
          imports:      [AvatarModule.forRoot({size: 70})],
          declarations: [AvatarWithRootConfigComponent],
          schemas:      [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    });

    afterEach(() => {
      fixture.destroy();
    });

    beforeEach(async () => {
      fixture   = TestBed.createComponent(AvatarWithRootConfigComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should apply root config values', async () => {
      const el = fixture.debugElement.query(
        By.directive(AvatarComponent)).componentInstance;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(el.options.size).toBe(70);
      });
    });
  });
});

@Component({
  template: `
              <ws-avatar [editable]="editable"></ws-avatar>`
})
class DefaultAvatarComponent {
  editable = false;
}

@Component({
  template: `
              <ws-avatar [size]="size" [image]="imageUrl"></ws-avatar>`
})
class AvatarWithInputComponent {
  imageUrl = AVATAR_IMAGE;
  size     = 100;
}

@Component({
  template: `
              <ws-avatar></ws-avatar>`
})
class AvatarWithRootConfigComponent {
}
