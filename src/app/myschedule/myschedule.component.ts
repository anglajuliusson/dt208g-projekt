import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { Courses } from '../model/courses';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-myschedule',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './myschedule.component.html',
  styleUrl: './myschedule.component.css'
})
export class MyscheduleComponent {
  selectedCourses: Courses[] = []; // Alla kurser i ramshcemat
  sortedCourseList: Courses[] = []; // Sorterade listan
  search: string = '';
  sortCourseList: boolean = true; // Stigande, fallande
  subjects: string[] = []; // Array med ämnen till dropdown
  selectedSubject: string = ''; // Det valda ämnet, tom sträng = visar alla ämnen

  constructor(private http: HttpClient, private scheduleService: ScheduleService) {}

  ngOnInit() {
    // Ladda ramschemat
    this.selectedCourses = this.scheduleService.getCourses();
    this.sortedCourseList = [...this.selectedCourses]; // Kopiera initialt

          // Hämta unika ämnen
          const allSubjects = this.selectedCourses.map(course => course.subject); // Hämtar alla ämnen
          this.subjects = Array.from(new Set(allSubjects)); // Tar bort dubbletter, konverterar tillbaka till en array
  }

  // Ta bort kurs och uppdatera listan
  removeCourse(courseCode: string) {
   // Ta bort kurs från service
  this.scheduleService.removeCourse(courseCode);

  // Uppdatera selectedCourses med den nya listan
  this.selectedCourses = this.scheduleService.getCourses();

  // Uppdatera dropdown för ämnen
  const allSubjects = this.selectedCourses.map(course => course.subject);
  this.subjects = Array.from(new Set(allSubjects));

  // Uppdatera filtrerad/sorterad lista
  this.filterData();
  }
  // Filtrerar data direkt när användaren skriver
  filterData() {
    const phrase = this.search.toLowerCase();
    this.sortedCourseList = this.selectedCourses.filter(course => {
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

  // Summera poängen för alla kurser i listan
  get totalPoints(): number {
    return this.sortedCourseList.reduce((sum, course) => sum + Number(course.points), 0);
  }
}
