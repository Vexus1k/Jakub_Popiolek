import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsStore, PostsFilters } from '../../data-access/posts.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-posts-list',
  template: `
    <section class="space-y-4">
      <h1 class="text-2xl font-bold">Posty</h1>

      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div class="flex-1">
          <label class="block text-sm">Szukaj</label>
          <input
            class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
            [value]="store.filters().searchText"
            (input)="setFilters({ searchText: $any($event.target).value })" placeholder="Szukaj w tytule i treści..."/>
        </div>
        <div>
          <label class="block text-sm">Użytkownik</label>
          <select
            class="border rounded-lg p-2 min-w-32 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
            [value]="store.filters().userId ?? ''"
            (change)="onUserChange($any($event.target).value)">
            <option value="">Wszyscy</option>
            @for (id of userIds; track id) {
              <option [value]="id">{{ id }}</option>
            }
          </select>
        </div>
        <label class="inline-flex items-center gap-2 select-none">
          <input type="checkbox" [checked]="store.filters().favoritesOnly"
                 (change)="setFilters({ favoritesOnly: $any($event.target).checked })"/>
          Tylko ulubione
        </label>
      </div>

      @if (store.loading()) {
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="h-28 rounded-xl bg-gray-200/80 animate-pulse"></div>
          }
        </div>
      } @else {
        @if (store.error(); as err) {
          <div class="text-red-600">{{ err }}</div>
        } @else {
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            @for (post of store.filteredPosts(); track post.id) {
              <article
                class="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-2 transition duration-200 hover:shadow-md hover:-translate-y-0.5">
                <h3 class="font-semibold line-clamp-2 text-gray-900">{{ post.title }}</h3>
                <p class="text-sm text-gray-600 line-clamp-3">{{ post.body }}</p>
                <div class="mt-2 flex justify-between items-center">
                  <button class="text-blue-600 hover:underline" (click)="go(post.id)">Szczegóły</button>
                  <button
                    class="text-sm px-2 py-1 rounded border border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:color-mix(in_oklab,_var(--color-primary)_12%,_white)]"
                    (click)="toggleFavorite(post.id)">
                    {{ isFavorite(post.id) ? '★ Ulubione' : '☆ Dodaj do ulubionych' }}
                  </button>
                </div>
              </article>
            }
          </div>
        }
      }
    </section>
  `,
})
export class PostsListPage {
  readonly store = inject(PostsStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() {
    const qp = this.route.snapshot.queryParamMap.get('userId');
    if (qp) this.store.setFilters({userId: Number(qp)});
    this.store.loadPosts();
  }

  public onUserChange(v: string): void {
    const userId = v ? Number(v) : null;
    this.router.navigate([], {queryParams: {userId: userId ?? null}, queryParamsHandling: 'merge'});
    this.setFilters({userId});
  }

  public setFilters(patch: Partial<PostsFilters>): void {
    this.store.setFilters(patch);
  }

  public trackById = (_: number, item: { id: number }): number => item.id;

  public go(id: number): void {
    this.router.navigate(['/posts', id]);
  }

  public toggleFavorite(id: number): void {
    this.store.toggleFavorite(id);
  }

  public isFavorite(id: number): boolean {
    return this.store.favoritesIds().has(id);
  }
}
