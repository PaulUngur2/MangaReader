import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Manga} from "./manga";
import {MangaAPIService} from "./manga-api.service";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private manga = new BehaviorSubject<Manga>(new Manga());
  selectedManga = this.manga.asObservable();

  constructor() {}

  setManga(manga: Manga) {
    this.manga.next(manga);
  }
}
