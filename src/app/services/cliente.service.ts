import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly Cliente = 'Cliente';
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

  getListaClientes() {
    return this._http.get(`${this.urlApi}/${this.Cliente}/`, this.getHeaders());
  }

  createCliente(data:any){
    return this._http.post(`${this.urlApi}/${this.Cliente}/`,data, this.getHeaders());
  }

  getCliente(idCliente: number) {
    return this._http.get(`${this.urlApi}/${this.Cliente}/GetClienteByIdUser/${idCliente}`, this.getHeaders());
  }

  updateCliente(idCliente: number, data: any) {
    return this._http.put(`${this.urlApi}/${this.Cliente}/ActualizarCliente/${idCliente}`, data, this.getHeaders());
  }

  // updateCliente(idCliente: number, data: any) {
  //   return this._http.put(`${this.urlApi}/${this.Cliente}/ActualizarCliente/${idCliente}`,data, this.getHeaders());
  // }

  deleteCliente(clienteId: string){
    return this._http.delete(`${this.urlApi}/${this.Cliente}/${clienteId}/`, this.getHeaders());
}
}