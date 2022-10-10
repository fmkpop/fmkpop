import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
      <tr *ngFor="let girl of data.girl">
        <td>{{girl.g}}</td>
        <td>{{girl.f}}</td>
        <td>{{girl.m}}</td>
        <td>{{girl.k}}</td>
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
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick() {
    this.router.navigate(['/'])
    this.dialogRef.close()
  }
}