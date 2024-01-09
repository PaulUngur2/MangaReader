import { Component, EventEmitter, Output, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MangaAPIService } from "src/app/manga-api.service";
import { SharedDataService } from "src/app/shared-data-service.service";
import { Observable, Subject, debounceTime, distinctUntilChanged, from, switchMap } from 'rxjs';
import { Manga } from "src/app/manga";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() mangaSelected = new EventEmitter<any>();
  title = '';
  searchResults: any[] = [];
  searchTerms = new Subject<string>();

  constructor(private mangaApi: MangaAPIService) {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.mangaApi.search(term, 0))
    ).subscribe(results => {
      this.searchResults = results.map(manga => ({ ...manga }));
    });
  }

  searchManga(event: any) {
    const query = event.query || event;
    this.searchTerms.next(query);
  }

  selectManga(manga: any) {
    this.mangaSelected.emit(manga);
  }
}