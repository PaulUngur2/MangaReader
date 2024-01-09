import {HttpClient} from '@angular/common/http';
import {Component, OnInit, inject} from '@angular/core';

import {
  LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
  ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService
} from '@syncfusion/ej2-angular-pdfviewer';
import * as marked from 'marked';
import {Chapter} from 'src/app/chapter';
import {ChapterPages} from 'src/app/chapter-pages';
import {Manga} from 'src/app/manga';
import {MangaAPIService} from 'src/app/manga-api.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {SharedDataService} from "../../shared-data.service";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  mangaApi = inject(MangaAPIService);
  sharedData = inject(SharedDataService);
  manga: Manga = new Manga();
  chapterList: Chapter[] = [];
  chapterPages: ChapterPages = new ChapterPages();
  pdfMake = pdfFonts.pdfMake.vfs;
  currentTab = 0;
  currentChapterNumber = 0;

  displayBasic: boolean = false;

  ngOnInit(): void {
    this.sharedData.selectedManga.subscribe(value => {
      this.manga = value;
      this.loadChapters(this.manga.id);
    });
    this.mangaApi.search('Pluto', 0).then(results => {
      this.manga = results[0];
    });
  }

  onMangaSelected(manga: Manga) {
    this.manga = manga;
  }

  onTabChange(event: any) {
    if (event.index === 1 && this.manga) {
      this.loadChapters(this.manga.id);
    }
  }

  get markdown() {
    return marked.parse(this.manga.description);
  }

  loadChapters(mangaId: string) {
    this.mangaApi.getChapters(mangaId).then(list => {
      this.chapterList = list;
    });
  }

  readChapter(chapterId: string, chapterNumber: number) {
    this.mangaApi.getChapterPages(chapterId).then(data => {
      this.chapterPages = data;
      this.currentTab = 2;
      this.currentChapterNumber = chapterNumber;
    });
  }

  nextChapter() {
    let index = this.findChapterIndex(this.currentChapterNumber) + 1;
    this.mangaApi.getChapterPages(this.chapterList[index].id).then(data => {
      this.chapterPages = data;
      this.currentChapterNumber = this.chapterList[index].chapterNumber;
    });
    this.scrollToTop();
  }

  prevChapter() {
    let index = this.findChapterIndex(this.currentChapterNumber) - 1;
    this.mangaApi.getChapterPages(this.chapterList[index].id).then(data => {
      this.chapterPages = data;
      this.currentChapterNumber = this.chapterList[index].chapterNumber;
    });
    this.scrollToTop();
  }

  private findChapterIndex(chapterNumber: number) {
    for (let i = 0; i < this.chapterList.length; i++) {
      if (this.chapterList[i].chapterNumber == chapterNumber) {
        return i;
      }
    }
    return -1;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
