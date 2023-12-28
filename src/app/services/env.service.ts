import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  public apiUrl = 'https://italapp.italcol.com/PollosApi/api';

  constructor() { }
}
