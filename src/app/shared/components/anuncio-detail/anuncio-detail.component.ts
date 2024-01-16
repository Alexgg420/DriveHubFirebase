import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { AnuncioInfoComponent } from '../anuncio-info/anuncio-info.component';

@Component({
  selector: 'app-anuncio-detail',
  templateUrl: './anuncio-detail.component.html',
  styleUrls: ['./anuncio-detail.component.css']
})

export class AnuncioDetailComponent implements OnInit {

  @Input() anun: Anuncio | null=null;

  constructor(
    private _modal: ModalController
  ) {}

  ngOnInit() {}

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }
}
