import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PantryService } from '../pantry.service';

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

  constructor(private ps: PantryService) { }

  @ViewChild(MatSort, { static: false }) sort!: MatSort
  displayedColumns = ["id", "name", "group", "f", "m", "k"];

  dataSource = new MatTableDataSource<GirlTable>([])

  ngOnInit(): void {
    this.ps.getLeaderboardStats().subscribe(girls => {
      this.dataSource.data = girls
      this.dataSource.sort = this.sort
    })
  }

  showModal(row: any) {
    console.log(row)
  }


}
