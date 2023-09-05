import { Component } from '@angular/core';

interface Link {
  name: string;
  url: string;
}

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss'],
})
export class SamplesComponent {
  links: Link[] = [];

  addLink() {
    this.links.push({ name: '', url: '' });
  }

  removeLink(index: number) {
    this.links.splice(index, 1);
  }
}
