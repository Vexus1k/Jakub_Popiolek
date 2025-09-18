import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostsStore } from '../../data-access/posts.store';

interface GanttItem {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

@Component({
  standalone: true,
  selector: 'app-gantt',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Gantt (bonus)</h1>
        <a class="text-blue-600" routerLink="/posts">← Lista</a>
      </div>

      @if (store.loading()) {
        <div class="h-28 rounded-xl bg-gray-200/80 animate-pulse"></div>
      } @else {
        @if (store.error(); as err) {
          <div class="text-red-600">{{ err }}</div>
        } @else {
          <div class="overflow-x-auto">
            <div class="min-w-[600px]">
              <div class="mb-2 text-xs text-gray-500 flex justify-between">
                <div>{{ formatDate(rangeStart()) }}</div>
                <div>{{ formatDate(rangeEnd()) }}</div>
              </div>
              <div class="relative border rounded-xl bg-white p-4">
                <div class="space-y-3">
                  @for (it of items(); track it.id) {
                    <div class="relative h-8 bg-gray-50 rounded-md overflow-hidden">
                      <div class="absolute inset-y-1 rounded-md bg-[color:var(--color-primary)]/15 border border-[color:var(--color-primary)]"
                           [style.left.%]="leftPercent(it)"
                           [style.width.%]="widthPercent(it)">
                        <div class="px-2 text-xs leading-6 text-[color:var(--color-primary)] truncate">
                          {{ it.title }}
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class GanttPage {
  readonly store = inject(PostsStore);

  // On first enter make sure we have posts loaded
  constructor() {
    if (!this.store.posts().length) {
      this.store.loadPosts();
    }
  }

  // Deterministic mock dates based on id
  private base = new Date();
  private startForId(id: number): Date {
    const d = new Date(this.base);
    d.setDate(d.getDate() - (id % 14));
    return d;
  }
  private endForId(id: number): Date {
    const d = new Date(this.base);
    d.setDate(d.getDate() + ((id % 5) + 1));
    return d;
  }

  readonly items = computed<GanttItem[]>(() =>
    this.store.posts().slice(0, 12).map(p => ({
      id: p.id,
      title: p.title,
      start: this.startForId(p.id),
      end: this.endForId(p.id),
    }))
  );

  readonly rangeStart = computed(() =>
    this.items().reduce((min, it) => it.start < min ? it.start : min, this.items()[0]?.start ?? new Date())
  );
  readonly rangeEnd = computed(() =>
    this.items().reduce((max, it) => it.end > max ? it.end : max, this.items()[0]?.end ?? new Date())
  );

  private totalMs(): number {
    return Math.max(1, this.rangeEnd().getTime() - this.rangeStart().getTime());
  }

  leftPercent(it: GanttItem): number {
    return ((it.start.getTime() - this.rangeStart().getTime()) / this.totalMs()) * 100;
    }

  widthPercent(it: GanttItem): number {
    return ((it.end.getTime() - it.start.getTime()) / this.totalMs()) * 100;
  }

  formatDate(d: Date): string { return d.toLocaleDateString(); }
}
