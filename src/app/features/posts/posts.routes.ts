import { Routes } from '@angular/router';

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/posts-list/posts-list.page').then(m => m.PostsListPage),
  },
  {
    path: 'gantt',
    loadComponent: () => import('./pages/gantt/gantt.page').then(m => m.GanttPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/post-details/post-details.page').then(m => m.PostDetailsPage),
  },
];
