import { Injectable } from '@angular/core';
import { Courses } from '../model/courses';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private selectedCourses: Courses[] = [];
  
  constructor() { 
    // Läs in från localstorage
    const saved = localStorage.getItem('myschedule'); 
    if (saved) { this.selectedCourses = JSON.parse(saved);
    }
}

// Hämta kopia av valda kurser
getCourses(): Courses[] {
  return [...this.selectedCourses]; // Returnera en kpoia
}

// Lägg till kurs, undviker dubletter
addCourse(course: Courses) {
  if (!this.selectedCourses.some(c =>
    c.courseCode === course.courseCode
  )){ this.selectedCourses.push(course);
    this.save(); // Uppdaterar localStorage
  }
}

// Ta bort kurs
removeCourse(courseCode: string) {
  this.selectedCourses = this.selectedCourses.filter (c =>
    c.courseCode !== courseCode);
    this.save(); // Uppdaterar localStorage
}
// Spara till localStorage
private save() {
  localStorage.setItem('mySchedule', JSON.stringify(this.selectedCourses));
}
}