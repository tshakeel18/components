import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreeViewComponent } from './pages/tree-view.component';

const routes: Routes = [
  {
    path: '',
    component: TreeViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreeViewRoutingModule { }
