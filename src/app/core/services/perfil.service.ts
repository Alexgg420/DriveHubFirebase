import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Perfil } from '../interfaces/perfil';
import { PerfilServiceInterface } from '../interfaces/perfil-service-interface';

@Injectable({
  providedIn: 'root'
})
export class PerfilService implements PerfilServiceInterface{
  private _perfil: BehaviorSubject<Perfil[]> = new BehaviorSubject<Perfil[]>([]);
  perfiles$: Observable<Perfil[]> = this._perfil.asObservable();

  constructor(private http:HttpClient) {}

  getAllPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(environment.apiUrl+'user-extensions').pipe(tap((perfiles:Perfil[])=>{
      this._perfil.next(perfiles);
    }))
  }
  getPerfil(id:number):Observable<Perfil>{
    return this.http.get<Perfil>(environment.apiUrl+`user-extensions/${id}`);
  }
  updatePerfil(perf: Perfil): Observable<Perfil> {
    return new Observable<Perfil>(observer=>{
      this.http.patch<Perfil>(environment.apiUrl+`user-extensions/${perf.id}`, perf).subscribe(_=>{
        this.getAllPerfiles().subscribe(_=>{
          this.getPerfil(perf.id).subscribe(_perf=>{
            observer.next(_perf);
          })
        })
      })
    })
  }
}
