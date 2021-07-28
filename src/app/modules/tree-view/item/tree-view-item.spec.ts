import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  DfTreeView,
  DfTreeViewItem,
  DfTreeViewLazyNode,
  DfTreeViewNode,
  DfTreeViewPayload,
} from '../index';
import { DfTreeViewOptions } from '../tree-view-options';

describe('DfTreeViewItem', () => {
  let fixture: ComponentFixture<any>;
  let treeView: DfTreeViewItem;
  let treeViewDebugElement: DebugElement;
  let treeViewElement: HTMLElement;
  // test data
  const noOfNodes: number = 3;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [
        DfTreeView,
        DfTreeViewItem,
        TreeViewWithItems,
        TreeViewWithNestedItems,
        TreeViewWithDisabledItems,
        TreeViewWithCustomIconsItems,
        TreeViewWithItemsWithEvents,
        TreeViewWithItemsWithTemplateLocalVariable,
        TreeViewWithFolderCustomIcons,
        TreeViewWithCollapsedFolder,
        TreeViewWithSingleExpansion,
        TreeViewWithCustomTemplate,
        TreeViewWithHandlers,
        TreeViewWithLazyLoad
      ]
    });
    TestBed.compileComponents();
  });

  describe('simple tree view', () => {
    beforeEach(() => {
      initFixture(TreeViewWithItems);
      fixture.detectChanges();
    });

    it('displays list of items', () => {
      expect(treeView.nodes.length).toEqual(noOfNodes);
      expect(treeViewElement.tagName.toLowerCase()).toEqual('df-tree-view-item');
    });

    describe('DfTreeViewNode', () => {
      let testNode: DfTreeViewNode;

      beforeEach(() => {
        testNode = treeView.nodes[0];
      });

      it('has nodes', () => {
        expect(treeView.hasNodes(testNode)).toBeFalsy();
      });

      it('has node expanded', () => {
        expect(treeView.isExpanded(testNode)).toBeFalsy();
      });
    });
  });

  describe('nested items', () => {
    beforeEach(() => {
      initFixture(TreeViewWithNestedItems);
      fixture.detectChanges();
    });

    it('allows nesting of items', () => {
      expect(treeView.nodes.length).toBeGreaterThan(0);
    });

    describe('DfTreeViewNode', () => {
      let testNode: DfTreeViewNode;
      const testIndex: number = 0;
      let testClickPayload: DfTreeViewPayload;

      beforeEach(() => {
        testNode = treeView.nodes[0];
        testClickPayload = {
          node: testNode,
          modKey: false
        };
        spyOn(treeView, 'toggleSelect').and.callThrough();
        spyOn(treeView, 'toggleExpand').and.callThrough();
        spyOn(treeView.deselected, 'emit').and.callThrough();
        spyOn(treeView.selected, 'emit').and.callThrough();
      });

      it('has nodes', () => {
        fixture.detectChanges();
        expect(treeView.hasNodes(testNode)).toBeTruthy();
      });

      describe('with item-content__name element', () => {
        let spanElement: HTMLElement;

        beforeEach(() => {
          spanElement = treeViewElement.querySelector('.item-content__name') as HTMLElement;
        });

        it('handles mouse clicks', fakeAsync(() => {
          expect(testNode.selected).toBeUndefined();
          spanElement.click();
          tick();
          flushMicrotasks();
          fixture.detectChanges();
          expect(treeView.toggleSelect).toHaveBeenCalledWith(testIndex, new MouseEvent('click'));
          expect(treeView.selected.emit).toHaveBeenCalledWith(testClickPayload);
          expect(testNode.selected).toBeTruthy();
        }));

        it('toggles selection on click', fakeAsync(() => {
          testNode.selected = true;
          spanElement.click();
          tick();
          testClickPayload.node['selected'] = false;
          expect(treeView.deselected.emit).toHaveBeenCalledWith(testClickPayload);
          fixture.detectChanges();
          expect(testNode.selected).toBeFalsy();
        }));
      });

      describe('with icon element', () => {
        let iconElement: HTMLElement;

        beforeEach(() => {
          iconElement = treeViewDebugElement.query(By.css('i')).nativeElement;
        });

        it('sets icons', () => {
          expect(iconElement.classList).toContain('fa-plus');
        });

        it('expands node on click', fakeAsync(() => {
          expect(treeView.isExpanded(testNode)).toBeFalsy();
          iconElement.click();
          tick();
          flushMicrotasks();
          expect(treeView.toggleExpand).toHaveBeenCalledWith(testNode);
          expect(treeView.isExpanded(testNode)).toBeTruthy();
          fixture.detectChanges();
          expect(iconElement.classList).toContain('fa-minus');
        }));
      });

      describe('with child tree view', () => {
        let childTreeView: DfTreeViewItem;
        beforeEach(() => {
          const liDebug: DebugElement = treeViewDebugElement.query(By.css('li'));
          const tvDebug: DebugElement = liDebug.children.find((elem: DebugElement) => {
            return elem.name === 'df-tree-view-item';
          });
          childTreeView = tvDebug.injector.get(DfTreeViewItem);
          spyOn(treeView, 'updateSelection').and.callThrough();
        });

        it('when child item is selected', fakeAsync(() => {
          const payLoad: DfTreeViewPayload = {
            node: childTreeView.nodes[0],
            modKey: false
          };
          fixture.detectChanges();
          childTreeView.childSelected.emit(payLoad);

          tick();
          flushMicrotasks();
          fixture.detectChanges();
          expect(treeView.updateSelection).toHaveBeenCalledWith(payLoad);
        }));
      });
    });
  });

  describe('disabled items tree view', () => {
    beforeEach(() => {
      initFixture(TreeViewWithDisabledItems);
    });

    it('allows disabling of items', () => {
      fixture.detectChanges();
      expect(treeView.nodes[1].disabled).toBeTruthy();
    });
  });

  describe('custom icons tree view', () => {
    beforeEach(() => {
      initFixture(TreeViewWithCustomIconsItems);
    });

    it('allows custom icons on items', () => {
      fixture.detectChanges();
      expect(treeView.nodes[0].icon).toBeDefined();
      expect(treeView.nodes[0].icon).toEqual('fa-html5');
    });
  });

  describe('event handler of tree view on host', () => {
    let testComponent: TreeViewWithItemsWithEvents;
    let spanElement: HTMLElement;
    const testNode: any = { node: { name: 'Item 1', id: '1' }, modKey: false };

    beforeEach(() => {
      initFixture(TreeViewWithItemsWithEvents);
      testComponent = treeViewDebugElement.componentInstance;
      fixture.detectChanges();
      spanElement = treeViewDebugElement.query(By.css('.item-content__name')).nativeElement;
      spyOn(testComponent, 'selected').and.callThrough();
      spyOn(testComponent, 'deselected').and.callThrough();
    });

    it('sends event on item selection', fakeAsync(() => {
      spanElement.click();
      tick();
      fixture.detectChanges();
      (testNode.node as any)['selected'] = true;
      expect(testComponent.selected).toHaveBeenCalledWith(testNode);
      expect(testComponent.selectedItems.length).toBeGreaterThan(0);
    }));

    it('sends event on item deselection', fakeAsync(() => {
      treeView.nodes[0].selected = true;
      spanElement.click();
      tick();
      fixture.detectChanges();
      (testNode.node as any)['selected'] = false;
      expect(testComponent.deselected).toHaveBeenCalledWith(testNode);
      expect(testComponent.deselectedItems.length).toBeGreaterThan(0);
    }));
  });

  describe('template local variable tree view', () => {
    let buttons: DebugElement[];

    beforeEach(() => {
      initFixture(TreeViewWithItemsWithTemplateLocalVariable);
      buttons = treeViewDebugElement.queryAll(By.css('button'));
    });

    it('allows access to select items', () => {
      fixture.detectChanges();
      expect(treeView.nodes[0].selected).toBeUndefined();
      buttons[0].nativeElement.click();
      fixture.detectChanges();
      expect(treeView.nodes[0].selected).toBeTruthy();
    });

    it('allows access to deselect items', () => {
      fixture.detectChanges();
      treeView.nodes[0].selected = true;
      buttons[0].nativeElement.click();
      fixture.detectChanges();
      expect(treeView.nodes[0].selected).toBeFalsy();
    });
  });

  describe('with folder having custom icons', () => {
    let iconElement: HTMLElement;
    const testClosedClass: string = 'fa-css3';
    const testOpenClass: string = 'fa-html5';

    beforeEach(() => {
      initFixture(TreeViewWithFolderCustomIcons);
      fixture.detectChanges();
      iconElement = treeViewDebugElement.query(By.css('i')).nativeElement;
    });

    it('has folderIcons attribute', () => {
      expect(treeView.nodes[0].folderIcons).toBeDefined();
      expect(treeView.nodes[1].folderIcons).toBeUndefined();
    });

    it('sets the closed icon', () => {
      expect(treeView.nodes[0].folderIcons.closed).toBeDefined();
      expect(iconElement.classList).toContain(testClosedClass);
    });

    it('sets the open icon', () => {
      expect(treeView.nodes[0].folderIcons.opened).toBeDefined();
      iconElement.click();
      fixture.detectChanges();
      expect(iconElement.classList).toContain(testOpenClass);
    });
  });

  describe('with single node expansion', () => {
    const closeFolderIcon: string = 'fa-folder';
    const openFolderIcon: string = 'fa-folder-open';
    const fileIcon: string = 'fa-file-o';

    beforeEach(() => {
      initFixture(TreeViewWithSingleExpansion);
      treeViewElement = treeViewDebugElement.nativeElement;
    });

    it('should draw the tree with 3 parent nodes', () => {
      fixture.detectChanges();
      const items: NodeListOf<Element> = treeViewElement
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      const assertion: number = 3;
      expect(items.length).toBe(assertion);
      let iconElement: HTMLElement = items[0].querySelector('i');
      expect(iconElement.classList.contains(closeFolderIcon)).toBe(true);
      iconElement = items[1].querySelector('i');
      expect(iconElement.classList.contains(closeFolderIcon)).toBe(true);
      const secondElementIndex: number = 2;
      iconElement = items[secondElementIndex].querySelector('i');
      expect(iconElement.classList.contains(fileIcon)).toBe(true);
    });

    it('should open the child node on clicking the icon', () => {
      fixture.detectChanges();
      const items: NodeListOf<Element> = treeViewElement
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      const iconElement: HTMLElement = items[0].querySelector('i');
      iconElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      const childItem: NodeListOf<Element> = items[0]
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      expect(childItem).not.toBe(null);
    });

    it('should open the child node on double clicking the item', () => {
      fixture.detectChanges();
      const items: NodeListOf<Element> = treeViewElement
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      const iconElement: Element = items[1].querySelector('.item-content__name');
      iconElement.dispatchEvent(new Event('dblclick'));
      fixture.detectChanges();
      const childItem: NodeListOf<Element> = items[1]
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      expect(childItem).not.toBe(null);
    });

    it('should expand the second item and close other', () => {
      fixture.detectChanges();
      const items: NodeListOf<Element> = treeViewElement
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      let iconElement: HTMLElement = items[0].querySelector('i');
      iconElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const childItem1: NodeListOf<Element> = items[0]
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      expect(childItem1).not.toBe(null);

      iconElement = items[1].querySelector('i');
      iconElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const childItem2: NodeListOf<Element> = items[1]
        .querySelectorAll('.df-tree-view-item__list > .df-tree-view-item__content');
      iconElement = items[1].querySelector('i');
      expect(childItem2).not.toBe(null);
      expect(iconElement.classList.contains(openFolderIcon)).toBe(true);

      iconElement = items[0].querySelector('i');
      expect(iconElement.classList.contains(openFolderIcon)).toBe(false);
    });
  });

  describe('with option to collapse folders', () => {
    beforeEach(() => {
      initFixture(TreeViewWithCollapsedFolder);
    });

    it('has collapsed nodes', () => {
      fixture.detectChanges();
      expect(treeView.nodes[0].name.indexOf('/')).toBeGreaterThan(-1);
      expect(treeView.nodes[0].nodes.length).toEqual(1);
    });
  });

  describe('with custom node template', () => {
    let testComponent: TreeViewWithCustomTemplate;

    function traverseNodes(nodes: DfTreeViewNode[], newTemplate: TemplateRef<any>): Array<DfTreeViewNode<any, any, any>> {
      // disabling the rule as it cannot be applied on list
      // tslint:disable-next-line:prefer-for-of
      for (let i: number = 0; i < nodes.length; i++) {
        if (nodes[i].template !== undefined) {
          nodes[i].template = newTemplate;
        }
        if (nodes[i].nodes && nodes[i].nodes.length > 0) {
          nodes[i].nodes = traverseNodes(nodes[i].nodes, newTemplate);
        }
      }
      return nodes;
    }

    beforeEach(() => {
      initFixture(TreeViewWithCustomTemplate);
      testComponent = treeViewDebugElement.componentInstance;
    });

    it('should render custom template for each node', fakeAsync(() => {
      testComponent.nodes = traverseNodes(testComponent.nodes, testComponent.customTemplate);
      fixture.detectChanges();
      const tickDelay: number = 100;
      tick(tickDelay);
      const itemContent: NodeListOf<Element> = treeViewElement
        .querySelectorAll('.df-tree-view-item__content-wrapper');
      const itemIcon: HTMLElement = itemContent[0].querySelector('i');
      let customNodeTemplates: NodeListOf<Element> = treeViewElement.querySelectorAll('.custom-template');
      expect(customNodeTemplates.length).toEqual(1);

      itemIcon.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick(tickDelay);

      const assetion: number = 2;
      customNodeTemplates = treeViewElement.querySelectorAll('.custom-template');
      expect(customNodeTemplates.length).toEqual(assetion);
    }));
  });

  describe('tree with handlers', () => {
    beforeEach(() => {
      initFixture(TreeViewWithHandlers);
      fixture.detectChanges();
    });

    it('displays list of items with handlers', () => {
      expect(treeViewElement.querySelector('.item-content__handler')).not.toBeNull();
      const assertion: number = 3;
      expect(treeViewElement.querySelectorAll('.item-content__handler').length).toBe(assertion);
    });
  });

  describe('tree with lazy loading', () => {
    beforeEach(() => {
      initFixture(TreeViewWithLazyLoad);
      fixture.detectChanges();
    });

    it('should display loading icon when a lazy loaded node is expanded', fakeAsync(() => {
      expect(treeViewElement.querySelector('.df-tree-view-item__loader-container')).toBeNull();
      const icon: Element = treeViewElement.querySelector('.item-content__icon');
      icon.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(treeViewElement.querySelector('.df-tree-view-item__loader-container')).not.toBeNull();
      const tickDelay: number = 100;
      tick(tickDelay);
      flushMicrotasks();
      fixture.detectChanges();
      expect(treeViewElement.querySelector('.df-tree-view-item__loader-container')).toBeNull();
    }));
  });

  /**
   * helper function to initialize fixture
   * @param component
   */
  function initFixture(component: any): void {
    fixture = TestBed.createComponent(component);
    treeViewDebugElement = fixture.debugElement;
    const treeViewDebug: DebugElement = treeViewDebugElement.query(By.directive(DfTreeViewItem));
    treeView = treeViewDebug.componentInstance;
    treeViewElement = treeViewDebug.nativeElement;
  }
});

// test components
// 1. simple tree view with list of items
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes"
                       [expanded]="true"
                       [options]="options"></df-tree-view-item>
  `
})
class TreeViewWithItems {
  nodes: DfTreeViewNode[] = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ];
  options: any = { multiselect: true };
}

// 2. tree view with nested items
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes"
                       [expanded]="true"
                       [options]="options"></df-tree-view-item>
  `
})
class TreeViewWithNestedItems {
  nodes: DfTreeViewNode[] = [
    {
      name: 'Item 1',
      nodes: [{ name: 'Sub item 1.1' }, { name: 'Sub item 2.1' }]
    },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ];

  /**
   * Use Fontawesome classes.
   * fa-file-open and fa-file are the defaults.
   */
  options: any = {
    iconFolderOpened: 'fa-minus',
    iconFolderClosed: 'fa-plus',
    multiselect: true
  };
}

// 3. tree view with disabled items
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes" [expanded]="true"></df-tree-view-item>
  `
})
class TreeViewWithDisabledItems {
  nodes: DfTreeViewNode[] = [
    { name: 'Item 1' },
    { name: 'Item 2', disabled: true },
    { name: 'Item 3' }
  ];
}

// 4. tree view with custom icons on items
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes"
                       [expanded]="true"
                       [options]="options"></df-tree-view-item>
  `
})
class TreeViewWithCustomIconsItems {
  options: any = {
    collapseFolders: true
  };
  nodes: DfTreeViewNode[] = [
    { name: 'Item 1', icon: 'fa-html5' },
    { name: 'Item 2' },
    { name: 'Item 3', icon: 'fa-css3' }
  ];
}

// 5. tree view with selected and deselected events
@Component({
  template: `
    <df-tree-view-item [expanded]="true"
      (selected)="selected($event)"
      (deselected)="deselected($event)"
      [nodes]="nodes">
    </df-tree-view-item>
  `
})
class TreeViewWithItemsWithEvents {
  nodes: DfTreeViewNode[] = [
    { name: 'Item 1', id: '1' },
    { name: 'Item 2', id: '2' },
    { name: 'Item 3', id: '3' }
  ];
  selectedItems: DfTreeViewNode[] = [];
  deselectedItems: DfTreeViewNode[] = [];

  deselected(event: DfTreeViewPayload): void {
    this.deselectedItems.push(event.node);
  }

  selected(event: DfTreeViewPayload): void {
    this.selectedItems.push(event.node);
  }
}

// 6. tree view with access as template local variables
@Component({
  template: `
    <df-tree-view-item #target
                       [expanded]="true"
                       [nodes]="nodes"></df-tree-view-item>
    <button (click)="callback(target, '1')"
            df-button>Toggle 1
    </button>
    <button (click)="callback(target, '2')"
            df-button>Toggle 2
    </button>
  `
})
class TreeViewWithItemsWithTemplateLocalVariable {
  nodes: DfTreeViewNode[] = [
    { name: 'Item 1', id: '1' },
    { name: 'Item 2', id: '2' },
    { name: 'Item 3', id: '1' }
  ];

  callback( target: DfTreeViewNode, id: string ): void {
    target.nodes.forEach((node: DfTreeViewNode<any, any, any>) => {
      if (node.id === id) {
        node.selected = !node.selected;
      }
    });
  }
}

// 7. tree view with nested items
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes" [expanded]="true"></df-tree-view-item>
  `
})
class TreeViewWithFolderCustomIcons {
  nodes: DfTreeViewNode[] = [
    {
      name: 'Item 1',
      folderIcons: { opened: 'fa-html5', closed: 'fa-css3' },
      nodes: [{ name: 'Sub item 1.1' }, { name: 'Sub item 2.1' }]
    },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ];
}

// 8. tree view with collapsed folders
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes"
                       [expanded]="true"
                       [options]="options"></df-tree-view-item>
  `
})
class TreeViewWithCollapsedFolder {
  options: any = {
    collapseFolders: true,
    collapseFolderSeparator: '/'
  };

  nodes: DfTreeViewNode[] = [
    {
      name: 'Folder 1',
      nodes: [{
        name: 'Folder 1.1',
        nodes: [{
          name: 'Folder 1.1.1',
          nodes: [{
            name: 'Item 1.1.1.1',
          }]
        }]
      }]
    },
    {
      name: 'Folder 2',
      nodes: [{
        name: 'Folder 2.1',
        nodes: [{
          name: 'Folder 2.1.1',
          nodes: [{
            name: 'Item 2.1.1.1',
          }]
        }, {
            name: 'Item 2.1.2',
          }]
      }]
    },
    { name: 'Item 3' }
  ];
}

// 9. tree view with single node to be opened at a time.
@Component({
  template: `
    <df-tree-view-item [nodes]="nodes"
                       [singleExpanded]="true"
                       [options]="options"
                       [expanded]="true"></df-tree-view-item>`
})
class TreeViewWithSingleExpansion {

  options: any = {
    iconFolderOpened: 'fa-folder-open',
    iconFolderClosed: 'fa-folder'
  };

  nodes: DfTreeViewNode[] = [
    {
      name: 'Folder 1',
      nodes: [{
        name: 'Folder 1.1',
        nodes: [{
          name: 'Folder 1.1.1'
        }]
      }]
    },
    {
      name: 'Folder 2',
      nodes: [{
        name: 'Folder 2.1',
        nodes: [{
          name: 'Folder 2.1.1'
        }, {
            name: 'Item 2.1.2',
          }]
      }]
    },
    { name: 'Item 3' }
  ];
}

// 10. tree view with custom template
@Component({
  template: `<df-tree-view-item [nodes]="nodes"
                                [expanded]="true"
                                [options]="options"></df-tree-view-item>
  <ng-template #customTemplate
               let-data>
    <div class="d-flex flex-row justify-content-center align-items-center custom-template">
      {{ data.name }}
      <i class="ml-2 fa fa-trash mb-0"></i>
    </div>
  </ng-template>
  `
})
class TreeViewWithCustomTemplate {
  @ViewChild('customTemplate') customTemplate: TemplateRef<any>;
  nodeTemplate: TemplateRef<any> = null;

  options: any = { multiselect: true };
  nodes: DfTreeViewNode[] = [];

  constructor() {
    this.nodes = [
      {
        name: 'Item 1',
        template: this.nodeTemplate,
        nodes: [
          {
            name: 'Sub item 1444',
            template: this.nodeTemplate,
            nodes: [
              {
                name: 'Item 55'
              },
              {
                name: 'Item 77'
              }
            ]
          },
          {
            name: 'Sub item 2'
          }
        ]
      },
      {name: 'Item 2'},
      {name: 'Item 3'}
    ];
  }
}

// 11. tree view with custom template
@Component({
  template: `<df-tree-view [nodes]="nodes"
                           [options]="options"></df-tree-view>
  `
})
class TreeViewWithHandlers {
  options: any = {
    showHandlers: true,
    iconFolderOpened: 'fa-users',
    iconFolderClosed: 'fa-users'
  };
  nodes: DfTreeViewNode[] = [
    {
      name: 'Item 1',
      nodes: [
        {
          name: 'Item 1.1',
          nodes: [
            {
              name: 'Item 1.1.1',
              icon: 'fa-user'
            }
          ]
        },
        {
          name: 'Item 1.2',
          nodes: [
            {
              name: 'Item 1.2.1',
              icon: 'fa-user'
            }
          ]
        }
      ]
    },
    {
      name: 'Item 2',
      nodes: [
        {
          name: 'Item 2.1',
          icon: 'fa-user'
        }
      ]
    },
    {
      name: 'Item 3',
      icon: 'fa-user'
    }
  ];
}

// 12. tree view with lazy loaded nodes
@Component({
  template: `<df-tree-view [nodes]="nodes"
                           [options]="options"></df-tree-view>
  `
})
class TreeViewWithLazyLoad {
  options: DfTreeViewOptions = {
    showHandlers: true,
  };
  nodes: DfTreeViewLazyNode[] = [
    {
      name: 'Item 1',
      lazy: true,
      loading: false,
      loaded: false,
      load: (): Observable<Array<DfTreeViewLazyNode<any, any, any>>> => {
        const children: DfTreeViewLazyNode[] = [];
        return of(children).pipe(delay(1));
      }
    }
  ];
}
