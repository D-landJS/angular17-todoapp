import { Routes } from '@angular/router';
import { TodoComponent } from './components/todo/todo.component';

export const routes: Routes = [
  {
    path: 'todo',
    component: TodoComponent,
  },
  {
    path: '**',
    redirectTo: 'todo',
    pathMatch: 'full',
  },
];
