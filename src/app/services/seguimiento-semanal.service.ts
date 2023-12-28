import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoSemanalService {
  private readonly InfoProductiva = 'InfoProductiva';
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

  getListaInfoProductiva() {
    return this._http.get(`${this.urlApi}/${this.InfoProductiva}/`, this.getHeaders());
  }

  createInfoProductiva(data:any){
    return this._http.post(`${this.urlApi}/${this.InfoProductiva}/`,data, this.getHeaders());
  }

  getInfoProductivaByLote(idLote: number) {
    return this._http.get(`${this.urlApi}/${this.InfoProductiva}/GetInfoProductivaByIdLote/${idLote}`, this.getHeaders());
  }

  updateInfoProductiva(idInfoProductiva: number, data: any) {
    return this._http.put(`${this.urlApi}/${this.InfoProductiva}/${idInfoProductiva}`, data, this.getHeaders());
  }

  deleteInfoProductiva(idInfoProductiva: string){
    return this._http.delete(`${this.urlApi}/${this.InfoProductiva}/${idInfoProductiva}`, this.getHeaders());
  }


}
