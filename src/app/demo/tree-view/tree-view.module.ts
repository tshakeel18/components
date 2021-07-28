import { NgModule } from '@angular/core';

import { TreeViewRoutingModule } from './tree-view-routing.module';
import { TreeViewComponent } from './pages/tree-view.component';
import { DfTreeViewModule } from '../../modules/tree-view';

@NgModule({
  imports: [
    TreeViewRoutingModule,
    DfTreeViewModule.forRoot()
  ],
  declarations: [TreeViewComponent]
})
export class TreeViewModule { }
