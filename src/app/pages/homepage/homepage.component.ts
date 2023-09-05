import { Component } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  tiles: Tile[] = [
    {text: 'Tutaj z Czasem Dodamy Chatbox do rozmowy', cols: 3, rows: 2, color: 'lightgreen'},
    {text: 'Nowości', cols: 1, rows: 2, color: 'Green'},
  ];
}
