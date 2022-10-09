import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import data from '../../assets/id_girls.json'
import { Girl, RedditJson, Card, GirlVote, VoteData } from '../model';
import _ from 'lodash';
import { PantryService } from '../pantry.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  constructor(private http: HttpClient, private ps: PantryService) { }

  url = `https://getpantry.cloud/apiv1/pantry/b79d34bf-9370-43fc-b088-d2ba6e5588e6/basket/girls`
  buttonStates: string[] = ['', '', '']
  girls: Girl[] = []
  localVotes = []
  data!: VoteData[]
  showNextButton = false
  cards: Observable<Card[]> = forkJoin([{}, {}, {}].map(_ => {
    const girl = this.randomGirl()
    this.girls.push(girl)
    return this.ps.getRedditImage(girl).pipe(map(imageUrl => {
      const title = girl.name + (girl.group ? " - " + girl.group : "")
      return { rows: 1, cols: 1, title, url: imageUrl } as Card
    }))
  }))

  ngOnInit() {
    this.readNetworkStorage().subscribe(data => this.data = data)
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
    const girlVotes = this.girls.map((g, i) => { return { ...g, vote: this.buttonStates[i] } })
    const body = { [time]: girlVotes }
    this.setLocalStorage(JSON.stringify(body))
    this.setNetworkStorage(body)
    this.alertData()
  }

  setNetworkStorage(payload: {}) {
    this.http.put(this.url, payload).subscribe(success => window.location.reload(), error => window.location.reload())
  }

  setLocalStorage(newVotes: string) {
    const curr = localStorage.getItem("fmkpop")
    const totalVotes = curr ? curr + ', ' + newVotes : newVotes
    console.log("ls", totalVotes)
    localStorage.setItem("fmkpop", totalVotes)
  }

  readLocalStorage() {
    const data = JSON.parse('[' + localStorage.getItem('fmkpop') + ']')
    this.localVotes = data.map((x: any) => Object.values(x)[0])
  }

  readNetworkStorage(): Observable<VoteData[]> {
    const fmk = (xs: string[], a: string) => xs.filter(l => l == a).length

    return this.http.get(this.url).pipe(map(data => {
      const votes: GirlVote[] = _.flatten(Object.values(data))
      const girlData = this.girls.map(g => votes.filter(v => g.id == v.id))
      const scores = girlData.map(g => g.map(v => v.vote))
      const numbers = scores.map((s, i) => {
        return { g: this.girls[i].name, f: fmk(s, 'f'), m: fmk(s, 'm'), k: fmk(s, 'k') }
      })
      console.log(numbers)
      return numbers
    }))
  }

  alertData() {
    const str = this.data.map(d => `${d.g} - f: ${d.f}, m: ${d.m}, k: ${d.k}`).join('\n')
    alert(str)
  }

  randId(): number {
    const rand = Math.floor(Math.random() * 676) + 1
    return this.girls.some(g => g.id === rand) ? this.randId() : rand
  }

  randomGirl(): Girl {
    const girl = data.find(girl => girl.id === this.randId()) || this.randomGirl()
    return girl
  }
}
