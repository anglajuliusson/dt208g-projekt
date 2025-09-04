import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Courses } from '../model/courses';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

// Properties
private url: string = "miun_courses.json";

  constructor(private http: HttpClient) { }

// Methods
getCourses(): Observable<Courses[]> {
  return this.http.get<Courses[]>(this.url);
}
}
