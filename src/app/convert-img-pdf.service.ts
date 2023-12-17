import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConvertImgPdfService {
  constructor(private http: HttpClient) {}

  convertImgPdf(files: string[]) {
    return this.http.post('/convert', { files });
  }
}
