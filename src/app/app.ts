import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-dvh flex flex-col">
      <header class="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div class="container mx-auto flex items-center justify-between p-4">
          <a routerLink="/posts" class="font-semibold text-[color:var(--color-primary)]">Posts</a>
          <nav class="flex items-center gap-4 text-sm">
            <a routerLink="/posts" routerLinkActive="font-semibold">Lista</a>
            <a routerLink="/posts/gantt" routerLinkActive="font-semibold">Gantt</a>
          </nav>
        </div>
      </header>
      <main class="container mx-auto flex-1 p-4">
        <router-outlet />
      </main>
      <footer class="border-t bg-white/60">
        <div class="container mx-auto p-4 text-xs text-gray-500">Angular 20 • Tailwind v4 • Signals</div>
      </footer>
    </div>
  `
})
export class App {}
