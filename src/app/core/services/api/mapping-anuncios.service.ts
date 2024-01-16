import { Injectable } from "@angular/core";
import { PaginatedData } from "../../interfaces/data"
import { Anuncio } from "../../interfaces/anuncios";

@Injectable({
  providedIn: 'root'
})
export abstract class MappingAnunciosService {

  public abstract queryAnunciosUrl():string;

  public abstract getAnuncioUrl(id:number):string;

  public abstract updateAnuncioUrl(id:number):string;

  public abstract deleteAnuncioUrl(id:number):string;
  
  public abstract mapAnuncios(data:PaginatedData<any>):PaginatedData<Anuncio>;

  public abstract mapAnuncio(data:any):Anuncio;
  
}