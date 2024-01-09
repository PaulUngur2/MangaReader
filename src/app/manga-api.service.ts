import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import axios from "axios";
import {Manga} from "./manga";
import {Chapter} from "./chapter";
import {ChapterPages} from "./chapter-pages";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangaAPIService {

  private _baseUrl = "https://api.mangadex.org"
  private _numberOfMangaEntries = 10;

  // TODO Add option for tag filtering
  async search(title: string, pageNumber: number) {
    let response = await axios({
      method: 'GET',
      url: `${this._baseUrl}/manga`,
      params: {
        title: title,
        includes: ["cover_art","author","artist"]//,
        // size: this._numberOfMangaEntries,
        // offset: pageNumber * this._numberOfMangaEntries
      }
    })

    console.log(response);

    let mangaList: Manga[] = [];

    let mangaArray = response.data.data;
    for (let i = 0; i < mangaArray.length; i++) {
      let mangaEntry = new Manga();
      mangaEntry.id = mangaArray[i].id;
      mangaEntry.type = mangaArray[i].type;
      mangaEntry.title = mangaArray[i].attributes.title.en;
      mangaEntry.description = mangaArray[i].attributes.description.en;
      mangaEntry.originalLanguage = mangaArray[i].attributes.originalLanguage;
      mangaEntry.publicationDemographic = mangaArray[i].attributes.publicationDemographic;
      mangaEntry.status = mangaArray[i].attributes.status;
      mangaEntry.year = mangaArray[i].attributes.year;
      mangaEntry.contentRating = mangaArray[i].attributes.contentRating;
      mangaEntry.state = mangaArray[i].attributes.state;

      // Add tags to array
      for (let j = 0; j < mangaArray[i].attributes.tags.length; j++) {
        mangaEntry.tags.push(mangaArray[i].attributes.tags[j].attributes.name.en);
      }

      // Add alternative titles
      for( let j = 0; j < mangaArray[i].attributes.altTitles.length; j++){
        if (mangaArray[i].attributes.altTitles[j].ja != null) {
          mangaEntry.title_ja = mangaArray[i].attributes.altTitles[j].ja;
        }else if ((mangaArray[i].attributes.altTitles[j]["ja-ro"] != null)){
          if (mangaEntry.title_ja_ro <  mangaArray[i].attributes.altTitles[j]["ja-ro"])
          mangaEntry.title_ja_ro = mangaArray[i].attributes.altTitles[j]["ja-ro"];
        }
      }

      // Find author, artist and cover art
      for (let j = 0; j < mangaArray[i].relationships.length; j++) {
        if (mangaArray[i].relationships[j].type == "author") {
          mangaEntry.author = mangaArray[i].relationships[j].attributes.name;
        }else if (mangaArray[i].relationships[j].type == "artist") {
          mangaEntry.artist = mangaArray[i].relationships[j].attributes.name;
        }else if (mangaArray[i].relationships[j].type == "cover_art") {
          let fileName = mangaArray[i].relationships[j].attributes.fileName;
          mangaEntry.coverArtSrc = `https://uploads.mangadex.org/covers/${mangaEntry.id}/${fileName}`;
          break;
        }
      }

      mangaList.push(mangaEntry);
    }

    return mangaList;
  }

  async getChapters(mangaId: string){
    let numberOfChaptersPerCall = 500;
    let numberOfChaptersInManga = 0;
    let languages: string[] = ["en"];
    let chapterList: Chapter[] = [];
    let currentPage = 0;

    do {
      let response = await axios({
        method: "get",
        url: `${this._baseUrl}/manga/${mangaId}/feed`,
        params: {
          includes: ["scanlation_group"],
          translatedLanguage: languages,
          limit: numberOfChaptersPerCall,
          offset: currentPage * numberOfChaptersPerCall
        }
      });
      numberOfChaptersInManga = response.data.total;

      let chaptersArray = response.data.data;
      for (let i = 0; i < chaptersArray.length; i++) {
        let chapter = new Chapter();
        chapter.id = chaptersArray[i].id;
        chapter.chapterNumber = parseFloat(chaptersArray[i].attributes.chapter);
        chapter.title = chaptersArray[i].attributes.title;
        chapter.volume = chaptersArray[i].attributes.volume;
        chapter.pageNumber = chaptersArray[i].attributes.pages;

        let groups: string[] = [];
        for (let j = 0; j < chaptersArray[i].relationships.length; j++) {
          if (chaptersArray[i].relationships[j].type == "scanlation_group") {
             groups.push(chaptersArray[i].relationships[j].attributes.name);
          }
        }

        chapter.group = groups.join(" & ");
        chapterList.push(chapter);
      }
      currentPage++;
    } while (currentPage * 500 < numberOfChaptersInManga)
    return chapterList.sort((a,b) => (a.chapterNumber < b.chapterNumber ? -1 : 1));
  }

  async getChapterPages(chapterId: string, dataSaver: boolean = false){
    let response = await axios({
        method: "get",
        url: `${this._baseUrl}/at-home/server/${chapterId}`
    });
    let chapterPages = new ChapterPages();

    chapterPages.baseUrl = response.data.baseUrl;
    chapterPages.hash = response.data.chapter.hash;

    let pages: string[] = [];
    if (!dataSaver) {
      let pageUrl = chapterPages.baseUrl + `/data/${chapterPages.hash}/`;
      for (let i = 0; i < response.data.chapter.data.length; i++) {
        pages.push(pageUrl + response.data.chapter.data[i]);
      }
    }else{
      let pageUrl = chapterPages.baseUrl + `/data-saver/${chapterPages.hash}/`;
      for (let i = 0; i < response.data.chapter.dataSaver.length; i++) {
        pages.push(pageUrl + response.data.chapter.dataSaver[i]);
      }
    }

    chapterPages.pages = pages;
    chapterPages.dataSaver = dataSaver;

    return chapterPages;
  }
}