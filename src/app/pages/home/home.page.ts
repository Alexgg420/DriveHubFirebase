import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Anuncio } from 'src/app/core/interfaces/anuncios';
import { BehaviorSubject, zip } from 'rxjs';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { AnunciosService } from 'src/app/core/services/anuncios.service';
import { Pagination } from 'src/app/core/interfaces/data';
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { MediaService } from 'src/app/core/services/api/media.service';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { AnuncioDetailComponent } from 'src/app/shared/components/anuncio-detail/anuncio-detail.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
 
  private _anuns = new BehaviorSubject<Anuncio[]>([]);
  public anuns$ = this._anuns.asObservable();
  public _pagination = new BehaviorSubject<Pagination>({page:0, pageSize:0, pageCount:0, total:0});
  private pagination$ = this._pagination.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  constructor(
    private router:Router,
    private toast:ToastController,
    public auth:AuthService,
    public anuns:AnunciosService,
    private media:MediaService,
    private modal:ModalController
  ) {
    
  }

  private loadAnun(page:number=0, refresher:any=null){
  
    this.anuns.query("").subscribe({
      next:response=>{
        this._anuns.next(response.data);
        this._pagination.next(response.pagination);
        
        if(refresher)refresher.complete();
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user=> {
      if (user?.id){
        this.getAnuncios(user.id);
      }
    })
  }

  private getAnuncios(userId: number) {
    this.anuns.getAllAnuncios(userId).subscribe({
      next:response => {
        this._anuns.next(response.data);
        this._pagination.next(response.pagination);
      },
      error:err => {
         console.log('Error al obtener los anuncios:', err);
      }
    });   
  }

  doRefresh(event:any){
    this.loadAnun(0, event.target);
  }

  public async onCardClicked(anun:Anuncio){
    
    var onDismiss = (info:any)=>{
      console.log(info);
      switch(info.role){
        case 'ok':{
          if(info.data.picture){
            dataURLtoBlob(info.data.picture,(blob:Blob)=>{
              this.media.upload(blob).subscribe((media:number[])=>{
                info.data.picture = media[0];
                let _anun = {id:anun.id, ...info.data};
                this.anuns.updateAnuncio(_anun).subscribe(async anun=>{
                  this.loadAnun();
                  const options:ToastOptions = {
                    message:"User modified",
                    duration:1000,
                    position:'bottom',
                    color:'tertiary',
                    cssClass:'card-ion-toast'
                  };
                  const toast = await this.toast.create(options);
                  toast.present();
                });
              });
            });
          }
          else{
            if(info.data.picture=="")
              info.data.picture = null;
            this.anuns.updateAnuncio(info.data).subscribe(async anun=>{
                this.loadAnun();
                const options:ToastOptions = {
                message:"Anuncio modified",
                duration:1000,
                position:'bottom',
                color:'tertiary',
                cssClass:'card-ion-toast'
              };
              const toast = await this.toast.create(options);
              toast.present();
            });
          }
        }
        break;
        case 'delete':{
          this.anuns.deleteAnuncio(info.data).subscribe(async anun=>{
            this.loadAnun();
            const options:ToastOptions = {
            message:"Anuncio deleted",
            duration:1000,
            position:'bottom',
            color:'tertiary',
            cssClass:'card-ion-toast'
          };
          const toast = await this.toast.create(options);
          toast.present();
        })
        }
        break;
        default:{
          console.error("No debería entrar");
        }
      }
    }
    this.presentForm(anun, onDismiss);
  }

  
  async presentForm(data:Anuncio|null, onDismiss:(result:any)=>void){
    
    const modal = await this.modal.create({
      component:AnuncioDetailComponent,
      componentProps:{
        anun:data
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }
}