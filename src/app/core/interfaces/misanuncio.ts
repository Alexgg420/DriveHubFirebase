import { PaginatedData } from "./data"
import { Media } from "./media"
import { User } from "./user"

/**
 * Interfaz con los datos que va a tener cada anuncio
 */
export interface Misanuncio {
    id: number,
    marca: String,
    modelo: String,
    year: Date,
    precio: number,
    img?: Media|null,
    userprop: number,
}

export type PaginatedMisanuncios = PaginatedData<Misanuncio>