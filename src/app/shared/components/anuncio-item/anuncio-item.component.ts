import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Anuncio } from 'src/app/core/interfaces/anuncios';

@Component({
  selector: 'app-anuncio-item',
  templateUrl: './anuncio-item.component.html',
  styleUrls: ['./anuncio-item.component.scss'],
})
export class AnuncioItemComponent  implements OnInit {

  private _anun:Anuncio|undefined;
  
  @Input('anuncio') set anun(_anun:Anuncio|undefined){
    this._anun = _anun;
  }

  @Output('clicked') clicked = new EventEmitter();

  get anun():Anuncio|undefined{
    return this._anun;
  }

  constructor() { }

  ngOnInit() {}

  onAnuncioClicked(){
    this.clicked.emit(this._anun);
  }
}