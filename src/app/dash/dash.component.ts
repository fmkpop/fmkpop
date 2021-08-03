import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import data from '../../assets/id_girls.json'
import { Girl, RedditJson, Card } from '../model';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  constructor(private http: HttpClient) { }

  form: FormGroup = new FormGroup({})

  cards: Observable<Card[]> = forkJoin([{}, {}, {}].map(_ => {
    const girl = this.randomGirl()
    return this.getRedditImage(girl).pipe(map(imageUrl => {
      return { rows: 1, cols: 1, title: girl.name + " - " + girl.group, url: imageUrl } as Card
    }))
  }))

  clicked() {

  }

  randomGirl(): Girl {
    const rand = Math.floor(Math.random() * 657)
    const girl = data.filter(girl => girl.id === rand)[0] || this.randomGirl()
    console.log(girl)
    return girl
  }

  redditSearch(girl: Girl) {
    const g = (girl.group as any).replaceAll(' ', '%2B').replace('IZ*ONE', 'IZ').replace('(G)I-DLE', 'DLE')
    const n = girl.name.replace(' ', '%2B')
    const exclusions = `-site%3Agfycat.com+-site%3Areddit.com+-site%3Av.redd.it+-url%3Agallery`
    return `https://reddit.com/r/kpics/search.json?jsonp=JSONP_CALLBACK&q=flair%3A${g}+${n}+${exclusions}&restrict_sr=on&sort=top&t=all`
  }

  getRedditImage(girl: Girl): Observable<string> {
    const reddit = this.redditSearch(girl)
    console.log(String(reddit).replace('.json', ''))
    return this.http.jsonp<RedditJson>(reddit, '').pipe(map(res => {
      const url = JSON.stringify(res.data?.children[0]?.data?.url) || ''
      return url.substring(1, url.length - 1)
    }))
  }
}