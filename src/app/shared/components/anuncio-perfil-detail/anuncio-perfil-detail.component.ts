import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { AnuncioInfoComponent } from '../anuncio-info/anuncio-info.component';
import { Router } from '@angular/router';
import { AnuncioFormComponent } from '../anuncio-form/anuncio-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anuncio-detail',
  templateUrl: './anuncio-perfil-detail.component.html',
  styleUrls: ['./anuncio-perfil-detail.component.scss']
})

export class AnuncioPerfilDetailComponent implements OnInit {

  @Input() anun: Anuncio | null = null;
  if (_: any){
    this.changeDetectorRef.markForCheck();
  }
  @Input() mode:'New'|'Edit' = 'Edit';

  constructor(
    private _modal:ModalController,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }

  onEdit() {
    this.presentEditModal(); // Presentar el modal de edición
  }

  async presentEditModal() {
    const modal = await this._modal.create({
      component: AnuncioFormComponent, // Usar el componente de formulario
      componentProps: {
        anun: this.anun, // Pasar el valor del formulario actual
        mode: 'Edit' // Indicar que el modo es de edición
      }
    });
    modal.onDidDismiss().then(data => {
      if (data.role === 'ok') {
        // Aquí puedes manejar la lógica después de editar el anuncio
        // Por ejemplo, actualizar los datos en la vista
        this.anun = data.data;
      }
    });
    return await modal.present();
  }
}