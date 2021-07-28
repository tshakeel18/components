import { InjectionToken } from '@angular/core';
import { DfTreeViewOptions } from './tree-view-options';

/**
 * The configuration token for the DfTreeView
 */
export const DF_TREE_VIEW_CONFIG_TOKEN: InjectionToken<DfTreeViewOptions> = new InjectionToken<DfTreeViewOptions>('df-tree-view.config');
