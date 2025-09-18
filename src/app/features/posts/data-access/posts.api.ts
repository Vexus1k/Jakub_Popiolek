import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, User, Comment } from '../../../core/models/post.model';

const API = 'https://jsonplaceholder.typicode.com';

@Injectable({ providedIn: 'root' })
export class PostsApi {
  private http = inject(HttpClient);

  public getPosts(userId?: number): Observable<Post[]> {
    const url = userId ? `${API}/posts?userId=${userId}` : `${API}/posts`;
    return this.http.get<Post[]>(url);
  }
  public getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${API}/posts/${id}`);
  }
  public getUser(id: number): Observable<User> {
    return this.http.get<User>(`${API}/users/${id}`);
  }
  public getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API}/posts/${postId}/comments`);
  }
}
