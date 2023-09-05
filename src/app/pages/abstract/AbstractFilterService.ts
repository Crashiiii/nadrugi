import { Injectable, OnInit } from "@angular/core";
import { AbstractFilter } from "./AbstractFilter";

@Injectable({
  providedIn: 'root',
})
export class AbstractFilterService extends AbstractFilter implements OnInit{

  ngOnInit(): void {
    this.logMessage('dupa')
  }
}