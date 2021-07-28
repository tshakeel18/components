import { DfTreeViewNode } from './tree-view-node';

/**
 * When a node gets selected or deselected, it will emit an event of this form.
 */
export class DfTreeViewPayload {
  /**
   * The selected or delected node.
   */
  node: DfTreeViewNode;
  /**
   * It is set if user has pressed the modifier key.
   */
  modKey: boolean;
}
