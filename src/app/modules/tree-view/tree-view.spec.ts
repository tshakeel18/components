import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfTreeViewItem } from './item/tree-view-item';
import { DfTreeView } from './tree-view';
import { DfTreeViewOptions } from './tree-view-options';
import { DF_TREE_VIEW_DEFAULT_OPTIONS } from './tree-view.constant';

describe('DfTreeView', () => {
  let component: DfTreeView;
  let fixture: ComponentFixture<DfTreeView>;
  const _node: any = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DfTreeView, DfTreeViewItem],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(DfTreeView);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should set options to default options when component.options is undefined', () => {
      component.ngOnInit();
      expect(component.options).toEqual(DF_TREE_VIEW_DEFAULT_OPTIONS);
    });

    it('set options to default options when component.options is undefined', () => {
      const options: DfTreeViewOptions = {
        multiselect: true,
        showHandlers: true
      };
      component.options = options;
      component.ngOnInit();

      expect(component.options).toEqual({...DF_TREE_VIEW_DEFAULT_OPTIONS, ...options});
    });
  });

  describe('passDeselected', () => {

    it('should emit deselected event with given payload', () => {
      spyOn(component.deselected, 'emit');
      const payload: any = {
        node: _node,
        modKey: true
      };
      component.passDeselected(payload);
      expect(component.deselected.emit).toHaveBeenCalled();
    });
  });

  describe('passSelected', () => {
    it('should emit selected event with given payload', () => {
      spyOn(component.selected, 'emit');
      const payload: any = {
        node: _node,
        modKey: true
      };
      component.passSelected(payload);
      expect(component.selected.emit).toHaveBeenCalled();
    });
  });

  describe('passSelected', () => {
    it('should emit childSelected event with given payload', () => {
      spyOn(component.childSelected, 'emit');
      const payload: any = {
        node: _node,
        modKey: true
      };
      component.passChildSelected(payload);
      expect(component.childSelected.emit).toHaveBeenCalled();
    });
  });

});
