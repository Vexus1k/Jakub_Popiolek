# Plan przed implementacją

## Struktura katalogów
```
src/
  app/
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
styles.css
```

## Komponenty (standalone)
- PostsListPage (`/posts`) – lista, filtry, skeletony
- PostDetailsPage (`/posts/:id`) – treść, autor, komentarze

## Serwisy / data-access
- PostsApi – HttpClient: `getPosts`, `getPost`, `getUser`, `getComments`
- PostsStore – signals + cache, filtry i ulubione

## Zarządzanie stanem
- Singleton `PostsStore` (`providedIn: 'root'`)
- signals: `posts`, `favoritesIds`, `loading`, `error`, `filters`
- computed: `filteredPosts`
- cache: Map kluczowana `all`/`user:{id}`
- Re-fetch tylko przy zmianie `userId` lub odświeżeniu strony

## Filtrowanie
- searchText – frontend (title/body)
- userId – query param → `GET /posts?userId=:id`
- favoritesOnly – front (po `favoritesIds`)

## Techniczne decyzje
- Angular 20, standalone, lazy routes
- Zoneless: `provideZonelessChangeDetection()`
- Animacje: gotowe pod dodanie `@animate.enter/leave` (MVP bez dodatkowej konfiguracji)
- Tailwind v4: `@import "tailwindcss"` + `@theme` w `styles.css`

## Podział prac (skrót)
1. Konfiguracja projektu, Tailwind, zoneless
2. API + modele + store (signals, cache)
3. Lista + filtry + ulubione
4. Szczegóły + autor + komentarze
5. README + dokumentacja

## Kryteria akceptacji
- Lista i szczegóły działają
- Filtry: tekst, userId, ulubione
- Cache ogranicza pobrania
- Responsywność i podstawowe skeletony
