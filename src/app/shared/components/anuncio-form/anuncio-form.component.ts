import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Anuncio } from 'src/app/core/interfaces/anuncios';

@Component({
  selector: 'app-anuncio-form',
  templateUrl: './anuncio-form.component.html',
  styleUrls: ['./anuncio-form.component.scss']
})
export class AnuncioFormComponent implements OnInit {

  form:FormGroup;
  @Input() set anun(_anun:Anuncio | null){
    if(_anun){
      this.form.controls['id'].setValue(_anun.id);
      this.form.controls['marca'].setValue(_anun.marca);
      this.form.controls['modelo'].setValue(_anun.modelo);
      this.form.controls['precio'].setValue(_anun.precio);
      this.form.controls['year'].setValue(_anun.year);
      this.form.controls['img'].setValue(_anun.img?.url_medium);
    }
  }
  @Input() mode:'New'|'Edit' = 'New';

  constructor(
    private _modal:ModalController,
    private formBuilder:FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      id:[null],
      marca:['', [Validators.required]],
      modelo:['', [Validators.required]],
      precio:[0, [Validators.required]],
      year:[1-1-2020, [Validators.required]],
      img:['']
    })
  }

  ngOnInit() {}

  onCancel() {
    this._modal.dismiss(null, 'cancel');
  }

  onSubmit() {
    if (this.form.valid) {
      // Aquí puedes manejar la lógica para guardar o actualizar el anuncio
      const formData = this.form.value;
      this._modal.dismiss(formData, 'ok');
    }
  }

  onDelete() {
    // Aquí puedes manejar la lógica para eliminar el anuncio
    this._modal.dismiss(this.form.value, 'delete');
  }

}
