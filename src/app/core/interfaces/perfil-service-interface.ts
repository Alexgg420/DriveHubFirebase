import { Observable } from "rxjs";
import { Perfil } from "./perfil";

export interface PerfilServiceInterface {
    /**
     * Obtiene todos los anuncios de la lista
     * @returns Observable de toda la lista de anuncios
     */
    getAllPerfiles():Observable<Perfil[]>;
    /**
     * Obtiene un anuncio de la lista
     * @returns Observable del anuncio obtenido
     */
    getPerfil(id:number):Observable<Perfil>;
}
