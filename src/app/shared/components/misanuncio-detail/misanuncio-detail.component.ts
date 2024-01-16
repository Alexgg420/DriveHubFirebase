import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Misanuncio } from 'src/app/core/interfaces/misanuncio';

@Component({
  selector: 'app-misanuncio-detail',
  templateUrl: './misanuncio-detail.component.html',
  styleUrls: ['./misanuncio-detail.component.scss'],
})
export class MisanuncioDetailComponent  implements OnInit {

  form:FormGroup;
  @Input() mode:'New'|'Edit' = 'New';
  @Input() set misanun(_misanun:Misanuncio|null){
    if(_misanun){
      this.form.controls['id'].setValue(_misanun.id);
      this.form.controls['marca'].setValue(_misanun.marca);
      this.form.controls['modelo'].setValue(_misanun.modelo);
      this.form.controls['precio'].setValue(_misanun.precio);
      this.form.controls['year'].setValue(_misanun.year);
      this.form.controls['img'].setValue(_misanun.img?.url_medium);
    }
  }

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

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }

  getDirtyValues(form: FormGroup) {
    let dirtyValues:any = {};

    Object.keys(form.controls)
        .forEach(key => {
            let currentControl = form.controls[key];
            if (currentControl.dirty)
              dirtyValues[key] = currentControl.value;
        });
    if(this.mode=='Edit')
        dirtyValues['id'] = this.form.controls['id'].value;
    return dirtyValues;
  }

  onSubmit(){
    this._modal.dismiss(this.getDirtyValues(this.form), 'ok');
  } 

  onDelete(){
    this._modal.dismiss(this.form.value, 'delete');
  }

  hasError(control:string, error:string):boolean{
    let errors = this.form.controls[control].errors;
    return errors!=null && error in errors;
  }
}
