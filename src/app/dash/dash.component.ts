import { Component } from '@angular/core';
import { of } from 'rxjs';
import data from '../../assets/id_girls.json'
import { Girl } from '../girl';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  constructor() { }

  emptyGirl: Girl = {
    id: 0,
    name: "Empty",
    group: "Girl"
  }

  randomGirl(): Girl {
    const rand = Math.floor(Math.random() * 657)
    console.log(rand)
    return data.filter(girl => girl.id === rand)[0] || this.emptyGirl
  }

  cards = of(
    [0, 0, 0]
      .map(_ => {
        const girl = this.randomGirl()
        return { rows: 1, cols: 1, title: girl.name + " - " + girl.group }
      })
  )
}
