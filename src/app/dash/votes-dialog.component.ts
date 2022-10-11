import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GirlVote, VoteData } from '../model';

@Component({
  selector: 'votes-dialog',
  template: `
  <div mat-dialog-content>
    <table>
      <tr>
        <th></th>
        <th>fucked</th>
        <th>married</th>
        <th>killed</th>
      </tr>
      <tr *ngFor="let girl of data.girls">
        <td>{{girl.g}}</td>
        <td>{{girl.f}}<div class="purple">{{check(girl.g, "f")}}</div></td>
        <td>{{girl.m}}<div class="purple">{{check(girl.g, "m")}}</div></td>
        <td>{{girl.k}}<div class="purple">{{check(girl.g, "k")}}</div></td>
      </tr>
    </table>
  </div>
  <div mat-dialog-actions align="end">
    <span>auto</span>
    <mat-slide-toggle color="primary" [(ngModel)]="auto"></mat-slide-toggle>
  </div>
  <div mat-dialog-actions align="end">
    <button mat-button (click)="onClick()">&nbsp;&nbsp;next&nbsp;&nbsp;</button>
  </div>
  `,
  styleUrls: ['votes-dialog.component.css']
})
export class VotesDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      girls: VoteData[],
      votes: GirlVote[]
    }) {
  }

  auto = localStorage.getItem('auto') == 'true'

  ngOnInit() {
    if (this.auto) this.onClick()
  }

  check(name: string, vote: string) {
    return this.data.votes.find(v => v.vote == vote && v.name == name) ? '+1' : ''
  }

  onClick() {
    localStorage.setItem('auto', this.auto ? 'true' : 'false')
    this.dialogRef.close()
  }
}