import { EventEmitter } from '@angular/core';

import { DfTreeViewNode } from './tree-view-node';
import { DfTreeViewPayload } from './tree-view-payload';
import { iconFile } from './tree-view.constant';

/**
 * DfTreeViewHelper class contains helper methods for treeview
 */
export class DfTreeViewHelper {
  /**
   * Deselects all the nodes and its children.
   *
   * @param nodes to be deselected.
   * @param deselected
   */
  static deselectAll(
    nodes: DfTreeViewNode[],
    deselected: EventEmitter<DfTreeViewPayload>
  ): void {
    nodes.forEach((node: DfTreeViewNode<any, any, any>) => {
      if (node.selected === true) {
        node.selected = false;
        deselected.emit({node, modKey: false});
      }
      if (DfTreeViewHelper.hasNonEmptyProp(node, 'nodes')) {
        DfTreeViewHelper.deselectAll(node.nodes, deselected);
      }
    });
  }

  /**
   * Deselects all the nodes and its children but the one with index 'index'.
   *
   * @param index of element to keep selected.
   * @param nodes to be deselected.
   * @param deselected
   */
  static deselectAllBut(
    index: number,
    nodes: DfTreeViewNode[],
    deselected: EventEmitter<DfTreeViewPayload>
  ): void {
    nodes.forEach((node: DfTreeViewNode<any, any, any>, key: number) => {
      if (index !== key) {
        if (node.selected === true) {
          node.selected = false;
          deselected.emit({node, modKey: false});
        }
        if (DfTreeViewHelper.hasNonEmptyProp(node, 'nodes')) {
          DfTreeViewHelper.deselectAll(node.nodes, deselected);
        }
      }
    });
  }

  /**
   * Deselects all the siblings in DfTreeViewHelper.node.
   *
   * @param nodes to deselect.
   * @param deselected
   */
  static deselectAllSiblings(
    nodes: DfTreeViewNode[],
    deselected: EventEmitter<DfTreeViewPayload>
  ): void {
    nodes.forEach((node: DfTreeViewNode<any, any, any>) => {
      if (node.selected === true) {
        node.selected = false;
        deselected.emit({node, modKey: false});
      }
    });
  }

  /**
   * Checks if a node as a prefered icon to show.
   *
   * @param node to check.
   */
  static getFileIcon(node: DfTreeViewNode): string {
    return DfTreeViewHelper.hasNonEmptyProp(node, 'icon') ? node.icon : iconFile;
  }

  /**
   * Checks if a property exists and is not empty in a node.
   *
   * @param node to be checked.
   * @param prop to check if it exists in the node and it's not empty.
   */
  static hasNonEmptyProp(node: DfTreeViewNode, prop: 'icon' |'id' | 'name' | 'nodes'): boolean {
    return node.hasOwnProperty(prop) ? (node[prop].length >= 1) : false;
  }

  /**
   * Whether or not a node has children nodes.
   *
   * @param node to be checked.
   */
  static isFolder(node: DfTreeViewNode): boolean {
    return DfTreeViewHelper.hasNonEmptyProp(node, 'nodes') || node.lazy;
  }

  /**
   * Checks if property is available with the node
   *
   * @param node to check.
   * @param prop to test.
   */
  static isPropTrue(node: DfTreeViewNode, prop: keyof DfTreeViewNode): boolean {
    return node.hasOwnProperty(prop) ? !!node[prop] : false;
  }

  /**
   * Toggle a certain property inside a node.
   *
   * @param node where the prop needs to be toggled.
   * @param prop to be toggled.
   */
  static toggleProp(node: DfTreeViewNode, prop: keyof DfTreeViewNode): void {
    if (node.hasOwnProperty(prop)) {
      (node as any)[prop] = !node[prop];
    } else {
      (node as any)[prop] = true;
    }
  }
}
