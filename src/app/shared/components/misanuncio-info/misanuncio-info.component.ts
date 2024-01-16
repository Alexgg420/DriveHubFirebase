import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Misanuncio } from 'src/app/core/interfaces/misanuncio';

@Component({
  selector: 'app-misanuncio-info',
  templateUrl: './misanuncio-info.component.html',
  styleUrls: ['./misanuncio-info.component.scss'],
})
export class MisanuncioInfoComponent  implements OnInit {

  @Input() misanun!:Misanuncio;

  @Output() onCardClicked:EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeleteClicked:EventEmitter<void> = new EventEmitter<void>();
  
  constructor(
    private router:Router
  ) { }
  
  ngOnInit() {}

  onCardClick(){
    this.onCardClicked.emit();
  }
}
