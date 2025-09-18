import { Injectable, computed, signal } from '@angular/core';
import { PostsApi } from './posts.api';
import { finalize } from 'rxjs';
import { Post } from '../../../core/models/post.model';

export interface PostsFilters { searchText: string; userId?: number | null; favoritesOnly: boolean }

@Injectable({ providedIn: 'root' })
export class PostsStore {
  private cache = new Map<string, Post[]>();

  readonly posts = signal<Post[]>([]);
  readonly favoritesIds = signal<Set<number>>(new Set());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filters = signal<PostsFilters>({ searchText: '', userId: null, favoritesOnly: false });

  readonly filteredPosts = computed(() => {
    const { searchText, favoritesOnly } = this.filters();
    const text = searchText.toLowerCase().trim();
    let list = this.posts();
    if (text) {
      list = list.filter(p => p.title.toLowerCase().includes(text) || p.body.toLowerCase().includes(text));
    }
    if (favoritesOnly) {
      const fav = this.favoritesIds();
      list = list.filter(p => fav.has(p.id));
    }
    return list;
  });

  constructor(private api: PostsApi) {}

  private key(userId?: number | null): string { return userId ? `user:${userId}` : 'all'; }

  public loadPosts(): void {
    const { userId } = this.filters();
    const k = this.key(userId ?? undefined);
    const cached = this.cache.get(k);
    if (cached) {
      this.posts.set(cached);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.getPosts(userId ?? undefined)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: data => { this.cache.set(k, data); this.posts.set(data); },
        error: err => this.error.set('Nie udało się pobrać postów'),
      });
  }

  public setFilters(patch: Partial<PostsFilters>): void {
    this.filters.update(f => ({ ...f, ...patch }));
    if (patch.userId !== undefined) {
      this.loadPosts();
    }
  }

  public toggleFavorite(id: number): void {
    this.favoritesIds.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
}
