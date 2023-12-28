import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ListasService {
  private readonly Pais = 'Pais';
  private readonly Departamento = 'Departamento';
  private readonly Municipio = 'Municipio';
  private readonly Listas='Listas';
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

  getListaPais() {
    return this._http.get(`${this.urlApi}/${this.Pais}/`, this.getHeaders());
  }

  getListaDepartamento(id:number){
    return this._http.get(`${this.urlApi}/${this.Departamento}/GetDepartamentoByIdPais/${id}`, this.getHeaders());
  }

  getListaMunicipio(id:number){
    return this._http.get(`${this.urlApi}/${this.Municipio}/GetMunicipioByIdDepartamento/${id}`, this.getHeaders());
  }

  getListas(id:number){
    return this._http.get(`${this.urlApi}/${this.Listas}/GetListasByIdTipoLista/${id}`, this.getHeaders());
  }

  calcularEdadPorSemana(id: number): number {
    // Aquí estamos suponiendo que los IDs empiezan en 85 y terminan en 92,
    // y cada ID representa una semana más que el anterior.
    if (id >= 85 && id <= 92) {
      return (id - 84) * 7;
    } else {
      return null; // Puedes devolver null o lanzar una excepción si el ID es inválido.
    }
  }


}
