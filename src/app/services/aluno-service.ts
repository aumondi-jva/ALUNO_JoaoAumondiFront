import { inject, Injectable } from '@angular/core';
import { AlunoModel } from '../models/alunoModel';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/alunos';

  listar(): Observable<AlunoModel[]> {
    return this.http.get<AlunoModel[]>(`${this.base}/listar`).
      pipe(catchError(this.handle));
  }

  adicionar(aluno: AlunoModel): Observable<AlunoModel>{
    return this.http
      .post<AlunoModel>(`${this.base}/salvar`, aluno)
      .pipe(catchError(this.handle));
  }

  remover(id : string): Observable<string>{
    return this.http.post(`${this.base}/apagar/${id}`, null,
      {responseType: 'text'}).pipe(catchError(this.handle));
  }

  editar(id: string, aluno: AlunoModel): Observable<AlunoModel>{
    return this.http.post<AlunoModel>(`${this.base}/editar/${id}`, aluno)
      .pipe(catchError(this.handle));
  }

    private handle(err: HttpErrorResponse){
      const msg = err.error?.message || err.error?.erro || err.message || 'Erro inesperado';
      return throwError( () => new Error(msg) );
    }

}
