import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  buttonStates: string[] = ['', '', '']
  girls: number[] = []

  cards: Observable<Card[]> = forkJoin([{}, {}, {}].map(_ => {
    const girl = this.randomGirl()
    this.girls.push(girl.id)
    return this.getRedditImage(girl).pipe(map(imageUrl => {
      return { rows: 1, cols: 1, title: girl.name + " - " + girl.group, url: imageUrl } as Card
    }))
  }))

  uniqueSelections = () => JSON.stringify([...this.buttonStates].sort()) == "[\"f\",\"k\",\"m\"]"

  watch(clicked: string, girl: number) {
    if (this.buttonStates.some(x => x != '')) {
      for (let i = 0; i < 3; i++) {
        if (this.buttonStates[i] == clicked)
          this.buttonStates[i] = ''
      }
      this.buttonStates[girl] = clicked
    }
    if (this.uniqueSelections()) {
      this.submitResults()
      window.location.reload()
    }
  }

  submitResults() {
    const body = {}

    // this.http.post(``, )
  }

  randId(): number {
    const rand = Math.floor(Math.random() * 654) + 1
    return this.girls.some(g => g === rand) ? this.randId() : rand
  }

  randomGirl(): Girl {
    const girl = data.find(girl => girl.id === this.randId()) || this.randomGirl()
    console.log(girl)
    return girl
  }

  redditSearch(girl: Girl) {
    const g = (girl.group as any).replaceAll(' ', '%2B').replace('IZ*ONE', 'IZ').replace('(G)I-DLE', 'DLE')
    const n = girl.name.replace(' ', '%2B')
    const exclusions = `-site%3Agfycat.com+-site%3Av.redd.it+-site%3Ainstagram.com+-site%3Astreamable.com+-url%3Agallery+-url%3A%2F%2Fa%2F%2F+-url%3Ajpg%3Aorig`
    return `https://reddit.com/r/kpics/search.json?jsonp=JSONP_CALLBACK&q=flair%3A${g}+${n}+${exclusions}&restrict_sr=on&sort=top&t=all`
  }

  getRedditImage(girl: Girl): Observable<string> {
    const reddit = this.redditSearch(girl)
    console.log(String(reddit).replace('.json', ''))
    return this.http.jsonp<RedditJson>(reddit, '').pipe(map(res => {
      const rand = Math.floor(Math.random() * Math.min(5, res.data?.children.length))
      const url = JSON.stringify(res.data?.children[rand]?.data?.url) || ''
      return url.substring(1, url.length - 1)
    }))
  }
}