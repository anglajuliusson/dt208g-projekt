import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { Courses } from '../model/courses';

@Component({
  selector: 'app-myschedule',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './myschedule.component.html',
  styleUrl: './myschedule.component.css'
})
export class MyscheduleComponent {
  selectedCourses: Courses[] = [];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    // Ladda ramschemat
    this.selectedCourses = this.scheduleService.getCourses();
  }

  // Ta bort kurs och uppdatera listan
  removeCourse(courseCode: string) {
    this.scheduleService.removeCourse(courseCode);
    this.selectedCourses = this.scheduleService.getCourses();
  }
}
