# Posts – Angular 20 (signals, zoneless, Tailwind v4)

Aplikacja rekrutacyjna prezentująca listę postów z API jsonplaceholder, z filtrowaniem, szczegółami i ulubionymi. Zbudowana na Angular 20, standalone components, signals, zoneless change detection i TailwindCSS v4.

## Wymagania
- Node >= 20
- Angular CLI 20

## Szybki start
1. Instalacja zależności
```bash
npm i
```
2. Uruchomienie dev servera
```bash
npm start
# lub
ng serve
```
Aplikacja: http://localhost:4200

3. Build produkcyjny
```bash
npm run build
```

## Funkcjonalności
- Lista postów z API: https://jsonplaceholder.typicode.com/posts
- Szczegóły posta: treść, autor (/users/:id), komentarze (/posts/:id/comments)
- Filtrowanie:
  - Pełnotekstowe po tytule/treści (frontend)
  - Po użytkowniku (userId) – zapytanie do API przez query param
  - Tylko ulubione – lokalny stan
- Ulubione: toggle; zapis ID w stanie (w pamięci)
- Cache: posty przechowywane w singleton service (signals store); re-fetch tylko przy zmianie userId lub refreshu
- Loader: skeletony
- Responsywność: mobile/desktop (Tailwind)
- Animacje: nowa składnia `animate.enter` / `animate.leave` na elementach listy i skeletonach

## Architektura i stan
- Standalone components + lazy routes
- Zoneless change detection (`provideZonelessChangeDetection`)
- Signals store (singleton) z cache w Map
- RxJS + HttpClient do asynchroniczności
- Tailwind v4 (`@import "tailwindcss"` + `@theme` w `src/styles.css`)

Struktura folderów (wycinek):
```
src/app/
  app.config.ts
  app.routes.ts
  core/
    models/
      post.model.ts
    features/
      posts/
        posts.routes.ts
        data-access/
          posts.api.ts
          posts.store.ts
        pages/
          posts-list/
            posts-list.page.ts
          post-details/
            post-details.page.ts
```
Pełny plan i uzasadnienie: docs/PLANNING.md

## Trasy
- `/posts` – lista z filtrami
- `/posts/gantt` – widok Gantta (bonus)
- `/posts/:id` – szczegóły posta

## Jak działa filtrowanie i cache
- searchText i favoritesOnly są stosowane frontowo na już pobranej liście
- userId zmienia klucz cache i powoduje (o ile brak w cache) pobranie z API `/posts?userId=:id`
- Cache kluczowany jako `all` lub `user:{id}`

## Modele i API
- Modele: `Post`, `User`, `Comment` (src/app/core/models/post.model.ts)
- PostsApi: `getPosts`, `getPost`, `getUser`, `getComments`

## Komendy
- `npm start` – uruchomienie dev
- `npm run build` – build prod
- `ng test` – testy (brak w tym MVP)

## Dalszy rozwój (pomysły)
- Osobna zakładka Ulubione i Gantt (bonus)
- Persist ulubionych w localStorage
- Testy jednostkowe dla store i api
- Lepsze animacje enter/leave i skeleton components
