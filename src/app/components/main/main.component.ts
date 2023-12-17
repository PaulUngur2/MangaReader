import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import {
  LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
   ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService
 } from '@syncfusion/ej2-angular-pdfviewer';
import * as marked from 'marked';
import { Chapter } from 'src/app/chapter';
import { ChapterPages } from 'src/app/chapter-pages';
// import { ConvertImgPdfService } from 'src/app/convert-img-pdf.service';
import { Manga } from 'src/app/manga';
import { MangaAPIService } from 'src/app/manga-api.service';
import * as pdfMake from "pdfmake/build/pdfmake"; 
import * as pdfFonts from "pdfmake/build/vfs_fonts";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  mangaApi = inject(MangaAPIService);
  // convertAPI = inject(ConvertImgPdfService);
  mangaList: Manga[] = [];
  chapterList: Chapter[] = [];
  chapterPages: ChapterPages = new ChapterPages();
  pdfMake = pdfFonts.pdfMake.vfs;

  displayBasic: boolean = false;

  constructor(private http: HttpClient) {
    this.initmanga();
  }

  get markdown() {
    return marked.parse(this.mangaList[0].description);
  }

  initmanga() {
    this.mangaApi.search('Rent A Girlfriend',0).then(list => this.mangaList = list);
    // this.mangaApi.getChapters(this.mangaList[0].id).then(list => this.chapterList = list);
  }

  openmanga(manga: any) {
    this.displayBasic = true;
  }

}
