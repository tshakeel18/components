import { TemplateRef } from '@angular/core';

import { DfImplicitContext } from '../core';
import { DfTreeViewFolderIcon } from './tree-view-folder-icon';
import { DfTreeViewLazyLoadFunction } from './tree-view-lazy-load-function';

/**
 * Base node interface
 */
export interface DfTreeViewBaseNode<T = any, C = T> {
  /**
   * Can be set to disable user interaction on treeview node.
   */
  disabled?: boolean;

  /**
   * Tracks if children of this node are shown or not.
   */
  expanded?: boolean;

  /**
   * A unique id corresponding to this node.
   */
  id?: string;

  /**
   * Related data attached to this node
   */
  data?: T;

  /**
   * The name of the node displayed to the user.
   */
  name?: string;

  /**
   * Track if user has selected the node and according highlight it.
   */
  selected?: boolean;

  /**
   * User custom template reference.
   */
  template?: TemplateRef<DfImplicitContext<DfTreeViewNode<T, C>>>;

  /**
   * An icon corresponding to this node.
   */
  icon?: string;

  /**
   * The children nodes of this node.
   */
  nodes?: Array<DfTreeViewNode<C>>;

  /**
   * Set custom icons for the node if its folder.
   */
  folderIcons?: DfTreeViewFolderIcon;
}

/**
 * Normal node for tree-view
 */
export interface DfTreeViewNormalNode<T = any, C = T>  extends DfTreeViewBaseNode<T, C> {
  lazy?: false;
}

/**
 *
 * Node with lazy-loaded children nodes
 */
export interface DfTreeViewLazyNode<T = any, C = T, L = C> extends DfTreeViewBaseNode<T, C> {

  /**
   * If this node's children are lazy-loaded - this is always true for this type
   */
  lazy: true;

  /**
   * If the node has loaded its children
   */
  loaded: boolean;

  /**
   * If the node is currently loading its children
   */
  loading: boolean;

  /**
   * The lazy loading function that loads the children nodes
   */
  load: DfTreeViewLazyLoadFunction<C, L>;
}

/**
 * Each node in the tree view should implement this interface.
 */
export type DfTreeViewNode<T = any, C = T, L = C> = DfTreeViewNormalNode<T, C> | DfTreeViewLazyNode<T, C, L>;
