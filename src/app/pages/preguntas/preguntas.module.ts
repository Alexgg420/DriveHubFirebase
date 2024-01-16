import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PreguntasPageRoutingModule } from './preguntas-routing.module';
import { PreguntasPage } from './preguntas.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreguntasPageRoutingModule,
    SharedModule
  ],
  declarations: [PreguntasPage]
})
export class PreguntasPageModule {}
