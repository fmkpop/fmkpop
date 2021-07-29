import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import data from '../../assets/id_girls.json'
import { Girl, RedditUrl, Card } from '../model';
import { SafeResourceUrlPipe } from './safeResourceUrlPipe';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  cards = forkJoin([{}, {}, {}].map(_ => {
    const girl = this.randomGirl()
    return this.getRedditImage(girl).pipe(map(imageUrl => {
      return { rows: 1, cols: 1, title: girl.name + " - " + girl.group, url: imageUrl } as Card
    }))
  }))

  randomGirl(): Girl {
    const rand = Math.floor(Math.random() * 657)
    console.log(rand)
    return data.filter(girl => girl.id === rand)[0]
  }


  redditFormat(g: Girl) {
    return `https://reddit.com/r/kpics/search.json?jsonp=JSONP_CALLBACK&q=flair%3A${g.group}+${g.name}+site%3Ai.redd.it&restrict_sr=on&sort=top&t=all`
  }

  getRedditImage(girl: Girl): Observable<string> {
    return this.http.jsonp<RedditUrl>(this.redditFormat(girl), '')
      .pipe(map(res => JSON.stringify(res.data?.children[0]?.data?.url)));
  }
}