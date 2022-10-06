import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import { GirlVote, GirlTable, Girl, RedditJson } from './model';
import { GroupedObservable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PantryService {

  constructor(private http: HttpClient) { }

  baseUrl = `https://getpantry.cloud/apiv1/pantry/b79d34bf-9370-43fc-b088-d2ba6e5588e6/basket/girls`

  getLeaderboardStats() {
    const fmk = (xs: string[], a: string) => xs.filter(l => l == a).length

    return this.http.get(this.baseUrl).pipe(map(data => {
      const votes: GirlVote[] = _.flatten(Object.values(data))
      const grouped = _.groupBy(votes, 'id')
      const cleaned = Object.values(grouped).map(g => {
        const f = fmk(g.map(x => x.vote), 'f')
        const m = fmk(g.map(x => x.vote), 'm')
        const k = fmk(g.map(x => x.vote), 'k')
        return { id: g[0].id, name: g[0].name, group: g[0].group, f, m, k }
      })
      return cleaned.filter(g => g.id != 0) as GirlTable[]
    }))
  }

  redditSearch(girl: Girl | GirlTable) {
    const g = (girl.group as any).replaceAll(' ', '%2B').replace('IZ*ONE', 'IZ').replace('(G)I-DLE', 'DLE')
    const n = girl.name.replace(' ', '%2B')
    const exclusions = `-site%3Agfycat.com+-site%3Av.redd.it+-site%3Ainstagram.com+-site%3Astreamable.com+-url%3Agallery+-url%3A%2F%2Fa%2F%2F+-url%3Ajpg%3Aorig`
    return `https://reddit.com/r/kpics/search.json?jsonp=JSONP_CALLBACK&q=flair%3A${g}+${n}+${exclusions}&restrict_sr=on&sort=top&t=all`
  }

  getRedditImage(girl: Girl | GirlTable): Observable<string> {
    const reddit = this.redditSearch(girl)
    console.log(String(reddit).replace('.json', ''))
    return this.http.jsonp<RedditJson>(reddit, '').pipe(map(res => {
      const rand = Math.floor(Math.random() * Math.min(10, res.data?.children.length))
      const url = JSON.stringify(res.data?.children[rand]?.data?.url) || ''
      return url.substring(1, url.length - 1)
    }))
  }
}
