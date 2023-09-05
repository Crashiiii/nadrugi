import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  private visitCount = 'visitCount';

  constructor() {}

  getVisitCount(): number {
    const visitCount = localStorage.getItem(this.visitCount);
    return visitCount ? parseInt(visitCount, 10) : 0;
  }

  incrementVisitCount(): void {
    const currentCount = this.getVisitCount();
    const newCount = currentCount + 1;
    localStorage.setItem(this.visitCount, newCount.toString());
  }
}
