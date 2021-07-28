import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { map, takeUntil } from 'rxjs/operators';

import { Constructor, DfDestructable, mixinDestructable } from '../../core';
import { DfTreeViewNode } from '../tree-view-node';
import { DfTreeViewOptions } from '../tree-view-options';
import { DfTreeViewPayload } from '../tree-view-payload';
import { DfTreeViewState } from '../tree-view-state';
import { expandCollapse } from '../tree-view.animation';
import * as constant from '../tree-view.constant';
import { DfTreeViewHelper as helper } from '../tree-view.helper';

export class DfTreeViewItemBase {}

/**
 * Base class with mixins applied
 */
export const _DfTreeViewItemBase: Constructor<DfDestructable> = mixinDestructable(DfTreeViewItemBase);

/**
 * Component class for tree view item
 */
@Component({
  selector: 'df-tree-view-item',
  templateUrl: './tree-view-item.html',
  styleUrls: ['./tree-view-item.scss'],
  animations: [expandCollapse],
  encapsulation: ViewEncapsulation.None
})
export class DfTreeViewItem extends _DfTreeViewItemBase
  implements OnChanges, OnInit, OnDestroy, DfDestructable {

  _destroy$: Subject<void>;

  /**
   * State for Treeview state
   */
  expandedState: DfTreeViewState = DfTreeViewState.Expanded;

  /**
   * The default template reference just in case the user doesn't provide one
   */
  @ViewChild('nodeDefaultTemplate') defaultNodeTemplate: TemplateRef<any>;

  /**
   * Whether or not a node is expanded
   */
  @Input() expanded: boolean;

  /**
   * The children nodes of this node.
   */
  @Input() nodes: DfTreeViewNode[] = [];

  /**
   * The options can be customized from the default.
   */
  @Input() options: DfTreeViewOptions = {};

  /**
   * Whether or not one node should be expanded at a time.
   */
  @Input() singleExpanded: boolean = false;

  /**
   * The event is triggered when a child is selected.
   */
  @Output() childSelected: EventEmitter<DfTreeViewPayload> = new EventEmitter();

  /**
   * The event is triggered when node is deselected.
   */
  @Output() deselected: EventEmitter<DfTreeViewPayload> = new EventEmitter();

  /**
   * The event is triggered when node is selected.
   */
  @Output() selected: EventEmitter<DfTreeViewPayload> = new EventEmitter();

  /**
   * Constructor for DfTreeViewItem
   * @param cdr Reference for change detector
   */
  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

  /**
   * Returns the best icon to use depending on the context.
   * @param node to check.
   */
  getIconClasses(node: DfTreeViewNode): string {
    if (helper.isFolder(node)) {
      if (this.isExpanded(node)) {
        const openIcon: string = helper.isPropTrue(node, 'folderIcons')
          ? node.folderIcons.opened
          : this.options.iconFolderOpened;
        return `
          ${constant.iconFolder}
          ${openIcon}
          ${node.disabled ? constant.iconFolderDisable : ''}
        `;
      } else {
        const closeIcon: string = helper.isPropTrue(node, 'folderIcons')
          ? node.folderIcons.closed
          : this.options.iconFolderClosed;
        return `
        ${constant.iconFolder}
        ${closeIcon}
        ${node.disabled ? constant.iconFolderDisable : ''}
      `;
      }
    } else {
      return `
        ${helper.getFileIcon(node)}
        ${node.disabled ? constant.iconFolderDisable : ''}
      `;
    }
  }

  /**
   * Whether or not node has children nodes.
   * @param node to check.
   */
  hasNodes(node: DfTreeViewNode): boolean {
    return helper.hasNonEmptyProp(node, 'nodes');
  }

  /**
   * Whether or not a node is expanded.
   * @param node to be checked.
   */
  isExpanded(node: DfTreeViewNode): boolean {
    return helper.isPropTrue(node, 'expanded');
  }

  /**
   * Transform boolean expand value to string so it can be animated.
   * @param changes on inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('expanded')) {
      if (changes.expanded.currentValue === true) {
        this.expandedState = DfTreeViewState.Expanded;
      } else if (changes.expanded.currentValue === false) {
        this.expandedState = DfTreeViewState.Collapsed;
      }
    }
  }

  /**
   * Initializing the options of the component.
   */
  ngOnInit(): void {
    // collapse nodes if any
    if (this.options.collapseFolders) {
      this.collapseNodes();
    }
  }

  /**
   * Reduces the nodes collection by collapsing the nodes with only a single folder
   */
  collapseNodes(): void {
    this.nodes.map((node: DfTreeViewNode<any, any, any>) => {
      node.name = this.getNodeName(node);
      if (helper.isFolder(node) && node.nodes.length === 1) {
        const children: Array<DfTreeViewNode<any, any, any>> = this.getLeafNode(node);
        if (children) {
          node.nodes = children;
        }
      }
    });
  }

  /**
   * Obtain the leaf node otherwise return the existing nodes collection
   * @param node being checked for leaf node
   */
  getLeafNode(node: DfTreeViewNode): DfTreeViewNode[] {
    if (helper.isFolder(node)) {
      if (node.nodes.length === 1) {
        return this.getLeafNode(node.nodes[0]);
      } else {
        return null;
      }
    }
    return [node];
  }

  /**
   * Moves the event upward in the tree
   * @param event
   */
  passDeselected(event: DfTreeViewPayload): void {
    this.deselected.emit(event);
  }

  /**
   * Moves the event upward in the tree
   * @param event
   */
  passSelected(event: DfTreeViewPayload): void {
    this.selected.emit(event);
  }

  /**
   * Toggles the selection state of a node.
   * @param index
   * @param event
   */
  toggleSelect(index: number, event: any): void {
    // Don't do anything if the node is disabled.
    if (!helper.isPropTrue(this.nodes[index], 'disabled')) {
      const modKey: any =
        (event as any)[constant.modKeyWin] ||
        (event as any)[constant.modKeyMac];

      helper.toggleProp(this.nodes[index], 'selected');

      // Checking the multiselect option and the modKey
      if (
        (!modKey && this.nodes[index].selected) ||
        !this.options.multiselect
      ) {
        // Deselect everything else but himself
        helper.deselectAllBut(index, this.nodes, this.deselected);
        // Deselect own childs if they exists
        if (helper.hasNonEmptyProp(this.nodes[index], 'nodes')) {
          helper.deselectAll(this.nodes[index].nodes, this.deselected);
        }
      }

      // Preparing payload to send in events.
      const payload: DfTreeViewPayload = {
        node: this.nodes[index],
        modKey
      };

      // Emit respective events.
      if (helper.isPropTrue(this.nodes[index], 'selected')) {
        this.selected.emit(payload);
        // Tell the parent to deselect respective nodes except this one
        this.childSelected.emit(payload);
      } else {
        this.deselected.emit(payload);
      }
    }
  }

  /**
   * Toggles the expand state of a node.
   * @param node
   */
  toggleExpand(node: DfTreeViewNode): void {
    // Don't do anything if node is disabled.
    if (!helper.isPropTrue(node, 'disabled')) {
      if (node.lazy && !node.loaded) {
        // node is lazy loaded and it hasn't been loaded yet, lets start it
        node.loading = true;
        node
          .load(node)
          .pipe(
            takeUntil(this._destroy$),
            map((children: Array<DfTreeViewNode<any, any, any>>, index: number) => {
              return {
                nodes: children,
                index
              };
            })
          )
          .subscribe((result: any) => {
            // once children are loaded, assign them to parent node and set loading properties
            node.loading = false;
            node.loaded = true;
            node.nodes = result.nodes;
            // in case we're getting more than one emission, then we shouldn't toggle the expanded property
            // unless it is the first nodes received.
            if (result.index === 0) {
              helper.toggleProp(node, 'expanded');
            }
            this.cdr.markForCheck();
          },
        () => {
          node.loading = false;
        });
      } else {
        helper.toggleProp(node, 'expanded');
      }
      if (this.singleExpanded) {
        this.closeAllNodesBut(node);
      }
    }
  }

  /**
   * If the node has a caret down handler icon
   * @param node
   */
  hasCaretDownIcon(node: DfTreeViewNode): boolean {
    const isExpanded: boolean = this.isExpanded(node);
    return (node.nodes || node.lazy) && isExpanded;
  }

  /**
   * If the node has a caret right handler icon
   * @param node
   */
  hasCaretRightIcon(node: DfTreeViewNode): boolean {
    const isExpanded: boolean = this.isExpanded(node);
    return (node.nodes || node.lazy) && !isExpanded;
  }

  /**
   * Collapses all sibling nodes but the one provided as input.
   * @param node
   */
  closeAllNodesBut(node: DfTreeViewNode): void {
    this.nodes
      .filter((childNode: DfTreeViewNode<any, any, any>) => childNode !== node)
      .forEach((childNode: DfTreeViewNode<any, any, any>) => (childNode.expanded = false));
  }

  /**
   * Deselects all the members in a certain tree level and emits to the
   * parent.
   * @param event
   */
  updateSelection(event: DfTreeViewPayload): void {
    // Checking multiselect option and modKey
    if (!event.modKey || !this.options.multiselect) {
      // All the siblings in this level needs to be deselected
      helper.deselectAllSiblings(this.nodes, this.deselected);
      // Deselect all the childs of these siblings except the one that
      // triggered the event
      this.nodes.forEach((node: DfTreeViewNode<any, any, any>, key: number) => {
        // Check if this node has the emiting child
        if (helper.hasNonEmptyProp(node, 'nodes')) {
          const index: number = node.nodes.findIndex((value: DfTreeViewNode<any, any, any>) => value === event.node);
          // The selected child as been found. Deselect the rest.
          if (index > -1) {
            helper.deselectAllBut(key, this.nodes, this.deselected);
            // This node will be used by the parent in the findIndex method
            const payLoad: DfTreeViewPayload = {
              node: this.nodes[key],
              modKey: event.modKey
            };
            // Tell the parent to do the same in his level
            this.childSelected.emit(payLoad);
          }
        }
      });
      this.cdr.detectChanges();
    }
  }

  /**
   * Gets name of the node accounting for collapsing the node if user has chosen so
   * @param node
   */
  getNodeName(node: DfTreeViewNode): string {
    if (this.options.collapseFolders && helper.isFolder(node)) {
      const collapsedName: string =
        node.name +
        this.options.collapseFolderSeparator +
        this.getNameFromNodes(node.nodes);
      const collapsingIndex: number = -3;
      return collapsedName.endsWith(this.options.collapseFolderSeparator)
        ? collapsedName.slice(0, collapsingIndex)
        : collapsedName;
    }

    return node.name;
  }

  /**
   * Get name from nodes
   * @param nodes
   */
  private getNameFromNodes(nodes: DfTreeViewNode[]): string {
    if (nodes) {
      if (nodes.length === 1 && helper.isFolder(nodes[0])) {
        return (
          nodes[0].name +
          this.options.collapseFolderSeparator +
          this.getNameFromNodes(nodes[0].nodes)
        );
      }
    }

    return '';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
