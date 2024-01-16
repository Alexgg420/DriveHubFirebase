/**
 * Interfaz con los datos que va a tener cada pesona en la página de su perfil
 */
export interface Perfil {
    id:number,
    name:string,
    surname:string,
    edad:number,
    location:string,
    img?:string
}
