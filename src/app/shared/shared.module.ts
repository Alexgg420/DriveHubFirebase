import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { createTranslateLoader } from '../core/services/custom-translate.service';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AnuncioInfoComponent } from './components/anuncio-info/anuncio-info.component';
import { AnuncioDetailComponent } from './components/anuncio-detail/anuncio-detail.component';
import { AnuncioPerfilDetailComponent } from './components/anuncio-perfil-detail/anuncio-perfil-detail.component';
import { AnuncioItemComponent } from './components/anuncio-item/anuncio-item.component';
import { MisanuncioInfoComponent } from './components/misanuncio-info/misanuncio-info.component';
import { MisanuncioDetailComponent } from './components/misanuncio-detail/misanuncio-detail.component';
import { ImgSelectableComponent } from './components/img-selectable/img-selectable.component';
import { TransformDatePipe } from './pipes/transform-date.pipe';
import { AboutDetailComponent } from './components/about-detail/about-detail.component';
import { AnuncioFormComponent } from './components/anuncio-form/anuncio-form.component';




@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    AnuncioItemComponent,
    AnuncioFormComponent,
    AnuncioInfoComponent,
    AnuncioPerfilDetailComponent,
    AnuncioDetailComponent,
    MisanuncioInfoComponent,
    MisanuncioDetailComponent,
    ImgSelectableComponent,
    HeaderComponent,
    AboutDetailComponent,
    TransformDatePipe,
    ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
  ],
  exports:[
    CommonModule, 
    IonicModule, 
    FormsModule,
    LoginFormComponent,
    RegisterFormComponent,
    AnuncioItemComponent,
    AnuncioFormComponent,
    AnuncioInfoComponent,
    AnuncioDetailComponent,
    AnuncioPerfilDetailComponent,
    MisanuncioInfoComponent,
    MisanuncioDetailComponent,
    ImgSelectableComponent,
    AboutDetailComponent,
    HeaderComponent,
    TransformDatePipe,
    TranslateModule
  ]
})
export class SharedModule { }