import { Observable } from 'rxjs';

import { DfTreeViewLazyNode, DfTreeViewNode } from './tree-view-node';

/**
 * The signature for the load children function for a lazy load node
 */
export type DfTreeViewLazyLoadFunction<T = any, C = T, L = C> = (
  node: DfTreeViewLazyNode<T, C, L>
) => Observable<Array<DfTreeViewNode<T, C, L>>>;
