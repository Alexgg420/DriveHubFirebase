import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { DataService } from './api/data.service';
import { MappingMisanuncioService } from './api/mapping-misanuncio.service';
import { PaginatedMisanuncios, Misanuncio } from '../interfaces/misanuncio';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';

export class MisanuncioNotFoundException extends Error {
  // . declare any additional properties or methods .
}

interface CrudMisanuncios {
  getAllMisanuncios(userprop: number): Observable<PaginatedMisanuncios>;
  addMisanuncio(misanun: Misanuncio): Observable<Misanuncio>;
  updateMisanuncio(misanun: Misanuncio): Observable<Misanuncio>;
  deleteMisanuncio(misanun: Misanuncio): Observable<Misanuncio>;
}

@Injectable({
  providedIn: 'root'
})
export class MisanuncioService implements CrudMisanuncios{
  private _misanuncios:BehaviorSubject<PaginatedMisanuncios> = new BehaviorSubject<PaginatedMisanuncios>({data:[], pagination:{page:0,pageCount:0, pageSize:0, total:0}});
  public misanuncios$:Observable<PaginatedMisanuncios> = this._misanuncios.asObservable();

  constructor(
    private http:HttpClient,
    private dataService:DataService,
    private mapping:MappingMisanuncioService,
    private apiService: ApiService
  ) {}

    public addMisanuncio(misanuncio: Misanuncio): Observable<Misanuncio> {
        return new Observable<Misanuncio>((obs) => {
            const misanun_payload: Misanuncio = {
                id: misanuncio.id,
                marca: misanuncio.marca,
                modelo: misanuncio.modelo,
                precio: misanuncio.precio,
                year: misanuncio.year,
                userprop: misanuncio.userprop,
                img: misanuncio.img
            };
            this.apiService.post('misanuncios', { data: misanun_payload }).subscribe({
                next: async (data: any) => {
                    obs.next(data);
                    obs.complete();
                },
                error: (err) => {
                    obs.error(err);
                }
            })
        })
    }

  public query(q: string): Observable<PaginatedMisanuncios> {
    // Si coincide el tipo de datos que recibo con mi interfaz
    return this.dataService.query<any>('misanuncios', {}).pipe(map(response => {
      return {
        data: response.data.map(misanuncio => {
          return {
            id: misanuncio.id,
            userprop: misanuncio.userprop,
            marca: misanuncio.marca,
            modelo: misanuncio.modelo,
            year: new Date(misanuncio.year),
            precio: misanuncio.precio,
            img: misanuncio.img
          };
        }),
        pagination: response.pagination
      };
    }));
  }

  public getAllMisanuncios(): Observable<PaginatedMisanuncios> {
    return this.dataService.query<any>(this.mapping.queryMisanuncioUrl(), {}).pipe(map(response => {
      return this.mapping.mapMisanuncio(response);
    }));
  }

  public getMisanuncio(id:number):Observable<Misanuncio>{
    return this.dataService.get<any>(this.mapping.getMisanuncioUrl(id)).pipe(map(this.mapping.mapMisanuncio.bind(this.mapping)));
  }

  public updateMisanuncio(misanuncio:Misanuncio):Observable<Misanuncio>{
    return this.dataService.put<any>(this.mapping.updateMisanuncioUrl(misanuncio.id!), misanuncio).pipe(map(this.mapping.mapMisanuncio.bind(this.mapping)));
  }

  public deleteMisanuncio(misanuncio:Misanuncio):Observable<Misanuncio>{
    return this.dataService.delete<any>(this.mapping.deleteMisanuncioUrl(misanuncio.id!)).pipe(map(this.mapping.mapMisanuncio.bind(this.mapping)));
  }
}