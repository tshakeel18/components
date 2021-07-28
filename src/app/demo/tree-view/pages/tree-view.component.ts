import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  DfTreeViewNode,
  DfTreeViewOptions,
  DfTreeViewPayload,
  DfTreeView,
  DfTreeViewLazyLoadFunction,
  DfTreeViewLazyNode,
} from '../../../modules/tree-view';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {
  @ViewChild('nodeTemplate') nodeTemplate: TemplateRef<any>;

  message = 'Click an item to test the events.';
  nodes: DfTreeViewNode[][];
  options: DfTreeViewOptions = {
    multiselect: true,
    collapseFolders: false,
  };

  lazyOptions: DfTreeViewOptions = {
    showHandlers: true,
  };

  collapsedFolderOptions: DfTreeViewOptions = {
    collapseFolders: true,
    collapseFolderSeparator: ' > '
  };

  showHandlersOptions: DfTreeViewOptions = {
    showHandlers: true,
    iconFolderOpened: 'fa-users',
    iconFolderClosed: 'fa-users'
  };

  useHandlers = false;

  infiniteNodeCounter = 0;

  callback(target: DfTreeView, id: string) {
    target.nodes.forEach(node => {
      if (node.id === id) {
        node.selected = !node.selected;
      }
    });
  }

  deselected(event: DfTreeViewPayload) {
    this.message = `
      Item <code>${event.node.name}</code> was <code>deselected</code>
    `;
  }

  selected(event: DfTreeViewPayload) {
    this.message = `
      Item <code>${event.node.name}</code> was <code>selected</code>.
    `;
  }

  infiniteLoad: DfTreeViewLazyLoadFunction = node => {
    this.infiniteNodeCounter += 1;
    const nodes: DfTreeViewLazyNode[] = [
      {
        name: `Infinite node ${this.infiniteNodeCounter}`,
        lazy: true,
        loading: false,
        loaded: false,
        load: this.infiniteLoad
      }
    ];
    return of(nodes).pipe(
      delay(500),
      map(loadedNodes => {
        const random = Math.random();
        const throwError = random > 0.7;
        if (throwError) {
          throw new Error();
        }

        return loadedNodes;
      })
    );
  }

  ngOnInit() {

    this.nodes = [
      [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
      [
        {
          name: 'Item 1',
          nodes: [{ name: 'Sub item 1' }, { name: 'Sub item 2' }]
        },
        { name: 'Item 2' },
        { name: 'Item 3' }
      ],
      [
        { name: 'Item 1' },
        { name: 'Item 2', disabled: true },
        { name: 'Item 3' }
      ],
      [
        { name: 'Item 1', icon: 'fa-html5' },
        { name: 'Item 2' },
        { name: 'Item 3', icon: 'fa-css3' }
      ],
      [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
      [
        { name: 'Item 1', id: '1' },
        { name: 'Item 2', id: '2' },
        { name: 'Item 3', id: '1' }
      ],
      [
        {
          name: 'Item 1',
          folderIcons: { opened: 'fa-html5', closed: 'fa-css3' },
          nodes: [{ name: 'Sub item 1' }, { name: 'Sub item 2' }]
        },
        { name: 'Item 2' },
        { name: 'Item 3' }
      ],
      [
        {
          name: 'Folder 1',
          nodes: [
            {
              name: 'Folder 1.1',
              nodes: [
                {
                  name: 'Folder 1.1.1',
                  nodes: [
                    {
                      name: 'Item 1.1.1.1'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'Folder 2',
          nodes: [
            {
              name: 'Folder 2.1',
              nodes: [
                {
                  name: 'Folder 2.1.1',
                  nodes: [
                    {
                      name: 'Item 2.1.1.1'
                    }
                  ]
                },
                {
                  name: 'Item 2.1.2'
                }
              ]
            }
          ]
        },
        { name: 'Item 3' }
      ],
      [
        {
          name: 'Item 1',
          nodes: [
            {
              name: 'Item 1.1',
              nodes: [{ name: 'Item 1.1.1' }]
            },
            {
              name: 'Item 1.2',
              nodes: [{ name: 'Item 1.2.1' }]
            }
          ]
        },
        { name: 'Item 2', nodes: [{ name: 'Item 2.1' }] },
        { name: 'Item 3' }
      ],
      [
        {
          name: 'Item 1',
          template: this.nodeTemplate,
          nodes: [
            {
              name: 'Sub item 1444',
              nodes: [
                {
                  name: 'Item 55'
                },
                {
                  name: 'Item 77',
                  template: this.nodeTemplate
                }
              ]
            },
            {
              name: 'Sub item 2'
            }
          ]
        },
        { name: 'Item 2' },
        { name: 'Item 3' }
      ],
      [
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
      ],
      [
        {
          name: 'Groups',
          lazy: true,
          loading: false,
          loaded: false,
          folderIcons: {
            opened: 'fa-group',
            closed: 'fa-group'
          },
          load: () => {
            const nodes: DfTreeViewNode[] = [
              {
                name: 'Sub group 1',
                // using same folder icon
                folderIcons: {
                  opened: 'fa-group',
                  closed: 'fa-group'
                },
                lazy: true,
                loading: false,
                loaded: false,
                load: () => {
                  const subNodes: DfTreeViewNode[] = [
                    {
                      name: 'Sub User 1',
                      icon: 'fa-user'
                    }
                  ];
                  return of(subNodes).pipe(delay(5000000));
                }
              },
              {
                name: 'User 1',
                icon: 'fa-user'
              }
            ];
            return of(nodes).pipe(delay(500));
          }
        },
        {
          name: 'Documents',
          folderIcons: {
            opened: 'fa-folder-open',
            closed: 'fa-folder'
          },
          lazy: true,
          loading: false,
          loaded: false,
          load: () => {
            const nodes: DfTreeViewNode[] = [
              {
                name: 'Subfolder',
                folderIcons: {
                  opened: 'fa-folder-open',
                  closed: 'fa-folder'
                },
                lazy: true,
                loading: false,
                loaded: false,
                load: () => {
                  const subNodes: DfTreeViewNode[] = [
                    {
                      name: 'File 2',
                      icon: 'fa-file'
                    }
                  ];
                  return of(subNodes).pipe(delay(500));
                }
              },
              {
                name: 'File 1',
                icon: 'fa-file'
              }
            ];
            return of(nodes).pipe(delay(500));
          }
        },
        {
          name: 'Infinite nodes',
          folderIcons: {
            opened: 'fa-folder-open',
            closed: 'fa-folder'
          },
          lazy: true,
          loading: false,
          loaded: false,
          load: this.infiniteLoad
        }
      ]
    ];
  }
}
