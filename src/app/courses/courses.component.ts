import { Component } from '@angular/core';
import { Courses } from '../model/courses';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../services/schedule.service';

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
  subjects: string[] = []; // Array med ämnen till dropdown
  selectedSubject: string = ''; // Det valda ämnet, tom sträng = visar alla ämnen
  clickedCourses: string[] = []; // Sparar vilka kurser som är markerade/”klara”

  constructor(private http: HttpClient, private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<Courses[]>('miun_courses.json').subscribe({
      next: (data) => {
        this.courselist = data;
        this.sortedCourseList = [...data]; // Kopiera initialt

      // Hämta unika ämnen
        const allSubjects = data.map(course => course.subject); // Hämtar alla ämnen
        this.subjects = Array.from(new Set(allSubjects)); // Tar bort dubbletter, konverterar tillbaka till en array
    
      },
      error: () => {
        console.error('Fel vid hämtning av data');
      }
    });
  }

  // Filtrerar data direkt när användaren skriver
  filterData() {
    const phrase = this.search.toLowerCase();
    this.sortedCourseList = this.courselist.filter(course => {
      const matchSearch =
      course.courseCode.toLowerCase().includes(phrase) ||
      course.courseName.toLowerCase().includes(phrase) ||
      course.points.toString().toLowerCase().includes(phrase);
      // Kolla om kursen matchar det valda ämnet (om ett ämne är valt)
      const matchSubject = this.selectedSubject ? course.subject === this.selectedSubject : true;
    // Returnera true om både söktext och ämnesfilter matchar
    return matchSearch && matchSubject;
    });
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
  // Lägg till kurs i ramschema och markera tillagd kurs
  addToScheduleAndMark(course: Courses) {
    // Lägg till kurs om den inte redan finns
    this.scheduleService.addCourse(course);
  
    // Markera knappen som klickad (som “completed”)
    if (!this.clickedCourses.includes(course.courseCode)) {
      this.clickedCourses.push(course.courseCode);
    }
  }
}
