import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import data from '../../assets/id_girls.json';
import { Card, Girl, GirlVote, VoteData } from '../model';
import { PantryService } from '../pantry.service';
import { VotesDialogComponent } from './votes-dialog.component';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private ps: PantryService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  buttonStates: string[] = ['', '', '']
  girls: Girl[] = []
  localVotes = []
  data!: VoteData[]
  showNextButton = false
  cards = forkJoin([{}, {}, {}].map(_ => {
    const girl = this.randomGirl()
    this.girls.push(girl)
    return this.ps.getRedditImage(girl).pipe(map(imageUrl => {
      const title = girl.name + " - " + (girl.group || "(soloist)")
      return { title, url: imageUrl }
    }))
  }))

  ngOnInit() {
    this.ps.getVoteData(this.girls).subscribe(data => this.data = data)
  }

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
    }
  }

  submitResults() {
    const time = new Date().toISOString()
    const girlVotes = this.girls.map((g, i) => ({ ...g, vote: this.buttonStates[i] }))
    const body = { [time]: girlVotes }
    this.setLocalStorage(JSON.stringify(body))
    this.ps.setNetworkStorage(body)
    this.alertData(girlVotes)
  }

  setLocalStorage(newVotes: string) {
    const curr = localStorage.getItem("fmkpop")
    const totalVotes = curr ? curr + ', ' + newVotes : newVotes
    localStorage.setItem("fmkpop", totalVotes)
  }

  readLocalStorage() {
    const data = JSON.parse('[' + localStorage.getItem('fmkpop') + ']')
    this.localVotes = data.map((x: any) => Object.values(x)[0])
  }

  alertData(votes: GirlVote[]) {
    const ref = this.dialog.open(VotesDialogComponent, {
      data: { girls: this.data, votes }
    })
    ref.afterClosed().subscribe(() => {
      this.router.navigate(['/'])
    })
  }

  randId(): number {
    const rand = Math.floor(Math.random() * 694) + 1
    return this.girls.some(g => g.id === rand) ? this.randId() : rand
  }

  randomGirl(): Girl {
    return data.find(girl => girl.id === this.randId()) || this.randomGirl()
  }

  isAuto = localStorage.getItem('auto') == 'true'

  disableAuto() {
    localStorage.setItem('auto', 'false')
    this.isAuto = false
  }
}

