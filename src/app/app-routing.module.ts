import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { DashComponent } from './dash/dash.component';

const routes: Routes = [
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', component: DashComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  }), CommonModule],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {

}

