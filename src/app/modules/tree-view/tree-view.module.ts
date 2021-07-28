import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DfTreeViewItem } from './item/tree-view-item';
import { DfTreeView } from './tree-view';
import { DF_TREE_VIEW_CONFIG_TOKEN } from './tree-view-config.token';
import { DfTreeViewOptions } from './tree-view-options';
import { DF_TREE_VIEW_DEFAULT_OPTIONS } from './tree-view.constant';

@NgModule({
  imports: [CommonModule],
  exports: [DfTreeView],
  declarations: [DfTreeView, DfTreeViewItem]
})

/**
 * Module to manage tree view
 */
export class DfTreeViewModule {
  /**
   * The forRoot method for this module, allowing global configuration
   * @param configuration The default configuration for all tree views
   */
  static forRoot(configuration: DfTreeViewOptions = DF_TREE_VIEW_DEFAULT_OPTIONS): ModuleWithProviders<DfTreeViewModule> {
    return {
      ngModule: DfTreeViewModule,
      providers: [
        {
          provide: DF_TREE_VIEW_CONFIG_TOKEN,
          useValue: configuration
        }
      ]
    };
  }
}
