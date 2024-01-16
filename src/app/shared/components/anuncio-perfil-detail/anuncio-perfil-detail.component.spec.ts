import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnuncioPerfilDetailComponent } from './anuncio-perfil-detail.component';

describe('AnuncioPerfilDetailComponent', () => {
  let component: AnuncioPerfilDetailComponent;
  let fixture: ComponentFixture<AnuncioPerfilDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnuncioPerfilDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnuncioPerfilDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
