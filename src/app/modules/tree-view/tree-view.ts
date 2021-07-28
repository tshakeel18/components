import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { DfTreeViewItem } from './item/tree-view-item';
import { DF_TREE_VIEW_CONFIG_TOKEN } from './tree-view-config.token';
import { DfTreeViewNode } from './tree-view-node';
import { DfTreeViewOptions } from './tree-view-options';
import { DfTreeViewPayload } from './tree-view-payload';
import { DF_TREE_VIEW_DEFAULT_OPTIONS } from './tree-view.constant';

/**
 * Component to display tree view
 */
@Component({
  selector: 'df-tree-view',
  templateUrl: 'tree-view.html',
  styleUrls: ['tree-view.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DfTreeView implements OnInit {

  /**
   * Tracks whether node is expanded or not.
   */
  @Input() expanded: boolean = true;

  /**
   * Whether or not one node should be expanded at a time.
   */
  @Input() singleExpanded: boolean = false;

  /**
   * The children nodes of this node.
   */
  @Input() nodes: DfTreeViewNode[] = [];

  /**
   * The options can be customized from the default.
   */
  @Input() options: DfTreeViewOptions = {};

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
   * Tree view item.
   */
  @ViewChild('treeViewItem') treeViewItem: DfTreeViewItem;

  /**
   * Used to set the class for host element
   */
  @HostBinding('class.df-tree-view')
  hostClass: boolean = true;

  constructor(
    @Inject(DF_TREE_VIEW_CONFIG_TOKEN)
    @Optional()
    protected config: DfTreeViewOptions = {}) {
  }

  /**
   * Initializing the options of the component.
   */
  ngOnInit(): void {
    this.options = Object.assign({}, DF_TREE_VIEW_DEFAULT_OPTIONS, this.config, this.options);
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
   * Moves the event upward in the tree
   * @param event
   */
  passChildSelected(event: DfTreeViewPayload): void {
    this.childSelected.emit(event);
  }

  /**
   * Triggers toggle expand on passed node
   * @param node
   */
  toggleNode(node: DfTreeViewNode): void {
    this.treeViewItem.toggleExpand(node);
  }
}
