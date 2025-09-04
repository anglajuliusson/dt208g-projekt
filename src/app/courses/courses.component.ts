import { Component } from '@angular/core';
import { Courses } from '../model/courses';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courselist: Courses[] = []; // Orginaldata
  sortedCourseList: Courses[] = []; // Sorterade listan
  search: string = '';
  sortCourseList: boolean = true; // Stigande, fallande

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<Courses[]>('miun_courses.json').subscribe({
      next: (data) => {
        this.courselist = data;
        this.sortedCourseList = [...data]; // Kopiera initialt
      },
      error: () => {
        console.error('Fel vid hämtning av data');
      }
    });
  }

  // Filtrerar data direkt när användaren skriver
  filterData() {
    const phrase = this.search.toLowerCase();
    this.sortedCourseList = this.courselist.filter(course =>
      course.courseCode.toLowerCase().includes(phrase) ||
      course.courseName.toLowerCase().includes(phrase) ||
      course.points.toString().toLowerCase().includes(phrase) ||
      course.subject.toLowerCase().includes(phrase)
    );
  }

  // Sortera efter valfritt fält
  sortBy(field: keyof Courses) {
    this.sortCourseList = !this.sortCourseList;
    this.sortedCourseList.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

    // Om värdet är number, jämför direkt
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return this.sortCourseList ? valueA - valueB : valueB - valueA;
    }

    // Annars strängjämförelse
      const strA = a[field].toLowerCase();
      const strB = b[field].toLowerCase();
      return this.sortCourseList ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }
}
