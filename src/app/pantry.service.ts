import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import { GirlVote, GirlTable } from './model';

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
}
