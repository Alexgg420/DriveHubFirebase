import { PaginatedData } from "./data"
import { Media } from "./media"

/**
 * Interfaz con los datos que va a tener cada anuncio
 */
export interface Anuncio {
    id: number,
    marca: String,
    modelo: String,
    year: Date,
    precio: number,
    img?: Media|null,
    userId: number,
}

export type PaginatedAnuncios = PaginatedData<Anuncio>