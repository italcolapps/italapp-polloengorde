import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class LotesService {
  private readonly Lote = 'Lote';
  private readonly urlApi = this.__env.apiUrl;
  private headers: HttpHeaders;

  constructor(
    private __env: EnvService,
    private _http: HttpClient,
    private _encryptService: CryptoService
  ) {
    this.initializeHeaders();
  }

  private initializeHeaders() {
    const tokenEncrypt = localStorage.getItem('jwt');
    if (tokenEncrypt) {
      const token = this._encryptService.decrypt(tokenEncrypt);
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.headers = new HttpHeaders();
    }
  }

  private getHeaders() {
    return { headers: this.headers };
  }

  getListaLotes() {
    return this._http.get(`${this.urlApi}/${this.Lote}/`, this.getHeaders());
  }

  createlote(data:any){
    return this._http.post(`${this.urlApi}/${this.Lote}/`,data, this.getHeaders());
  }

  getLoteByIdGalpon(idGalpon: number) {
    return this._http.get(`${this.urlApi}/${this.Lote}/GetLoteByIdGalpon/${idGalpon}`, this.getHeaders());
  }

  updateLote(idLote: number, data: any) {
    return this._http.put(`${this.urlApi}/${this.Lote}/${idLote}`, data, this.getHeaders());
  }

  deleteLote(idLote: string){
    return this._http.delete(`${this.urlApi}/${this.Lote}/${idLote}`, this.getHeaders());
  }



}

