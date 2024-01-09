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

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  mangaApi = inject(MangaAPIService);
  mangaList: Manga[] = [];
  chapterList: Chapter[] = [];
  chapterPages: ChapterPages = new ChapterPages();
  pdfMake = pdfFonts.pdfMake.vfs;

  displayBasic: boolean = false;

  constructor(private http: HttpClient) {
    this.mangaApi.search('Pluto',0).then(list => this.mangaList = list);
  }

  ngOnInit(): void {
  }

  onMangaSelected(manga: Manga) {
    this.mangaList = [manga];
  }

  get markdown() {
    return marked.parse(this.mangaList[0].description);
  }

  openmanga(manga: any) {
    this.displayBasic
    this.mangaApi.getChapters(manga.id).then(list => this.chapterList = list);
  }

}
