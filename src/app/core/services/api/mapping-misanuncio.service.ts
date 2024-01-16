import { Injectable } from "@angular/core";
import { PaginatedData } from "../../interfaces/data"
import { Misanuncio } from "../../interfaces/misanuncio";

@Injectable({
  providedIn: 'root'
})
export abstract class MappingMisanuncioService {

  public abstract queryMisanuncioUrl():string;

  public abstract getMisanuncioUrl(id:number):string;

  public abstract updateMisanuncioUrl(id:number):string;

  public abstract deleteMisanuncioUrl(id:number):string;
  
  public abstract mapMisanuncio(data:PaginatedData<any>):PaginatedData<Misanuncio>;

  public abstract mapMisanuncio(data:any):Misanuncio;
  
}