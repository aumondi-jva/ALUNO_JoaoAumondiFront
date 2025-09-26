import { Component, inject, OnInit } from '@angular/core';
import { AlunoService } from '../../services/aluno-service';
import { AlunoModel } from '../../models/alunoModel';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-aluno-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './aluno-component.html',
  styleUrls: ['./aluno-component.css']
})
export class AlunoComponent implements OnInit {

  private service = inject(AlunoService);

  alunos: AlunoModel[] = [];

  editarAluno: AlunoModel | null = null;
  novoNome = '';
  novoCurso = '';
  novoTelefone = '';
  erro = '';
  sucesso = '';

  loading = false;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.service.listar()
      .subscribe({
        next: d => {
          this.alunos = d;
          this.loading = false;
        },
        error: e => {
          this.erro = e.message;
          this.loading = false;
        }
      });
  }

  adicionar(form?: NgForm) {
    this.erro = '';
    if (!this.novoNome || this.novoNome.trim().length < 3) {
      this.erro = 'Nome é obrigatório e deve ter ao menos 3 caracteres.';
      return;
    }
    if (!this.novoCurso || this.novoCurso.trim().length < 3) {
      this.erro = 'Curso é obrigatório e deve ter ao menos 3 caracteres.';
      return;
    }

    const payload: AlunoModel = {
      id: '',
      nome: this.novoNome.trim(),
      curso: this.novoCurso.trim(),
      telefone: this.novoTelefone
    };

    this.loading = true;
    this.service.adicionar(payload).subscribe({
      next: (p) => {
        this.sucesso = `Aluno salvo com sucesso`;
        this.loading = false;
        this.novoNome = '';
        this.novoCurso = '';
        this.novoTelefone = '';
        if (form) form.resetForm();
        this.carregar();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: (e) => {
        this.erro = e.message || 'Falha ao salvar o aluno.';
        this.loading = false;
      }
    });
  }

  remover(id: string) {
    this.service.remover(id).subscribe({
      next: (msg: string) => {
        this.sucesso = msg || "Aluno apagado";
        this.carregar();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: e => {
        this.erro = e.message || "Falha ao remover o aluno.";
      }
    });
  }

  salvarEdicao(form?: NgForm) {
    if (!this.editarAluno || !this.editarAluno.id) {
      return;
    }

    if (form && form.invalid) {
      this.erro = 'Corrija os campos do formulário antes de salvar.';
      return;
    }

    if (!this.editarAluno.nome || this.editarAluno.nome.trim().length < 3) {
      this.erro = 'Nome é obrigatório e deve ter ao menos 3 caracteres.';
      return;
    }
    if (!this.editarAluno.curso || this.editarAluno.curso.trim().length < 3) {
      this.erro = 'Curso é obrigatório e deve ter ao menos 3 caracteres.';
      return;
    }

    this.loading = true;
    this.service.editar(this.editarAluno.id, this.editarAluno).subscribe({
      next: result => {
        if (result) {
          this.carregar();
          this.sucesso = 'Aluno atualizado com sucesso';
          if (form) form.resetForm();
          this.editarAluno = null;
          setTimeout(() => this.sucesso = '', 3000);
        }
        this.loading = false;
      },
      error: e => {
        this.erro = e.message || 'Falha ao editar';
        this.loading = false;
      }
    });
  }
}
