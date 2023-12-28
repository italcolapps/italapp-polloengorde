import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculosInfoSemanalService {

  constructor() { }

  calcPrecioPonderado(
    consumoPreinicio:number, precioPreinicio:number  ,
    consumoInicio:number, precioInicio,
    consumoEngorde:number, precioEngorde ,consumoTotal) {
    let pondPreinicio = (consumoPreinicio / consumoTotal) * precioPreinicio;
    let pondInicio = (consumoInicio / consumoTotal) * precioInicio;
    let pondEngorde = (consumoEngorde / consumoTotal) * precioEngorde;
    let precioPonderado = pondPreinicio + pondInicio + pondEngorde;

    return precioPonderado

  }
}
