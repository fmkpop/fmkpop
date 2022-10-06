import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PantryService } from '../pantry.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Girl } from '../model';


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
export class LeaderboardComponent implements OnInit {

  constructor(private ps: PantryService, public dialog: MatDialog) { }

  @ViewChild(MatSort, { static: false }) sort!: MatSort
  displayedColumns = ["id", "name", "group", "f", "m", "k"];

  dataSource = new MatTableDataSource<GirlTable>([])

  ngOnInit(): void {
    this.ps.getLeaderboardStats().subscribe(girls => {
      this.dataSource.data = girls
      this.dataSource.sort = this.sort
    })
  }

  showModal(row: GirlTable) {
    this.ps.getRedditImage(row as Girl).subscribe(url => {
      this.dialog.open(ImageDialogComponent, {
        maxHeight: '90vh',
        maxWidth: '30vw',
        data: { ...row, url }
      })
    })
  }
}

@Component({
  selector: 'image-dialog',
  template: `
  <h3 style="margin-top: 0px; margin-bottom: 18px" mat-dialog-title>
    {{data.name}} - {{data.group}}
  </h3>
  <div mat-dialog-content>
    <img style='height: 100%; width: 100%; object-fit: cover' [src]=data.url>
  </div>`
})
export class ImageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}