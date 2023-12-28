import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private readonly myKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImRpYW5hbWFyY2VsYV8xMC4xOEBob3RtYWlsLmNvbSIsImp0aSI6IjhhMmM5NjVlLWExNTItNGNiMS1iNDQ2LTBmOGU4NDM3NjE4NyIsInJvbFVzZXIiOiIxIiwiaWRVc2VyIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwMjMvMDcvMjggMzo0OTozOCIsImV4cCI6MTY5MDUxNjE3OCwiaXNzIjoiaHR0cHM6Ly9pdGFsYXBwLml0YWxjb2wuY29tL1BvbGxvIiwiYXVkIjoiaHR0cHM6Ly9pdGFsYXBwLml0YWxjb2wuY29tL1BvbGxvIiwicGF5TG9hZCI6eyJ1c2VyIjp7IklkIjoyLCJOb21icmUiOiJEaWFuYSIsIkFwZWxsaWRvIjoiQ29udHJlcmFzIiwiRW1haWwiOiJkaWFuYW1hcmNlbGFfMTAuMThAaG90bWFpbC5jb20iLCJSb2wiOjF9fX0.LNdYqcilF2LscVwL0QmnE_LNU8yDgp2lOZFSlZRFbH4';

  constructor() { }

  encrypt(value: string): string {
    return CryptoJS. AES.encrypt(value, this.myKey).toString();
  }

  decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.myKey).toString(CryptoJS.enc.Utf8);
  }
}
