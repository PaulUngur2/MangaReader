import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import {
  LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
   ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService
 } from '@syncfusion/ej2-angular-pdfviewer';
import * as marked from 'marked';
import { Chapter } from 'src/app/chapter';
import { ChapterPages } from 'src/app/chapter-pages';
import { Manga } from 'src/app/manga';
import { MangaAPIService } from 'src/app/manga-api.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {SharedDataService} from "../../shared-data.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  mangaApi = inject(MangaAPIService);
  sharedData = inject(SharedDataService);
  manga: Manga = new Manga();
  chapterList: Chapter[] = [];
  chapterPages: ChapterPages = new ChapterPages();
  pdfMake = pdfFonts.pdfMake.vfs;

  displayBasic: boolean = false;

  ngOnInit(): void {
    this.sharedData.selectedManga.subscribe(value => {
      this.manga = value;
    })
  }

  onMangaSelected(manga: Manga) {
    this.manga = manga;
  }

  get markdown() {
    return marked.parse(this.manga.description);
  }

  openmanga(manga: any) {
    this.displayBasic
    this.mangaApi.getChapters(manga.id).then(list => this.chapterList = list);
  }

}
