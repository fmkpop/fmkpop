import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Girl, GirlVote, VoteData } from '../model';

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
    <button mat-button color="#a68bf0" (click)="onClick()">next</button>
  </div>
  `,
  styleUrls: ['votes-dialog.component.css']
})
export class VotesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VotesDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {
      girls: VoteData[],
      votes: GirlVote[]
    }) {
    console.log(data)
  }

  check(name: string, vote: string) {
    return this.data.votes.find(v => v.vote == vote && v.name == name) ? '+1' : ''
  }

  onClick() {
    this.router.navigate(['/'])
    this.dialogRef.close()
  }
}