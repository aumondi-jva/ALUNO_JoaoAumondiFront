import { Routes } from '@angular/router';
import { AlunoComponent } from './component/aluno-component/aluno-component';
import { HomeComponent } from './component/home-component/home-component';

export const routes: Routes = [
{path: 'alunos', component: AlunoComponent},
{path: '', component: HomeComponent}

];
