import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsApi } from '../../data-access/posts.api';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Post, User, Comment } from '../../../../core/models/post.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-post-details',
  template: `
    <section class="space-y-4 max-w-3xl mx-auto">
      <a routerLink="/posts" class="text-blue-600">← Wróć do listy</a>

      @if (loading()) {
        <div class="h-28 rounded-xl bg-gray-200/80 animate-pulse"></div>
      } @else {
        @if (error(); as err) {
          <div class="text-red-600">{{ err }}</div>
        } @else {
          <h1 class="text-3xl font-bold tracking-tight">{{ post()?.title }}</h1>
          <p class="text-gray-700 leading-relaxed">{{ post()?.body }}</p>

          <div class="mt-4 p-4 border rounded-xl bg-white">
            <h2 class="font-semibold mb-2">Autor</h2>
            @if (user()) {
              <div class="text-sm">{{ user()?.name }} ({{ user()?.email }})</div>
            } @else {
              <div class="h-6 w-40 rounded bg-gray-200 animate-pulse"></div>
            }
          </div>

          <div class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Komentarze</h2>
            <div class="space-y-3">
              @for (c of comments(); track c.id) {
                <div class="p-3 border rounded-xl bg-white">
                  <div class="font-medium">{{ c.name }}</div>
                  <div class="text-sm text-gray-600">{{ c.email }}</div>
                  <p class="mt-1">{{ c.body }}</p>
                </div>
              }
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class PostDetailsPage {
  private route = inject(ActivatedRoute);
  private api = inject(PostsApi);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly post = signal<Post | null>(null);
  readonly user = signal<User | null>(null);
  readonly comments = signal<Comment[]>([]);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      post: this.api.getPost(id),
      comments: this.api.getComments(id),
    })
      .pipe(
        switchMap(({ post, comments }) => {
          this.post.set(post);
          this.comments.set(comments);
          return this.api.getUser(post.userId).pipe(catchError(() => of(null)));
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (user) => {
          this.user.set(user);
        },
        error: () => {
          this.error.set('Nie udało się pobrać szczegółów');
        },
      });
  }
}
