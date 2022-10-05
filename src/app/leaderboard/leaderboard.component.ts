import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { GirlVote } from '../model';

interface GirlTable {
  id?: number;
  name: string;
  group?: string;
  f: number;
  m: number;
  k: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements AfterViewInit {

  constructor(
    private http: HttpClient
  ) { }

  @ViewChild(MatSort, { static: false }) sort = new MatSort();
  displayedColumns = ["name", "f", "m", "k"];


  url = `https://getpantry.cloud/apiv1/pantry/b79d34bf-9370-43fc-b088-d2ba6e5588e6/basket/girls`
  dataSource = new MatTableDataSource<GirlTable>([])

  ngAfterViewInit(): void {
    this.readNetworkStorage().subscribe(girls => {
      this.dataSource.data = girls
      this.dataSource.sort = this.sort
    })
  }

  readNetworkStorage() {
    const fmk = (xs: string[], a: string) => xs.filter(l => l == a).length

    return this.http.get(this.url).pipe(map(data => {
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
