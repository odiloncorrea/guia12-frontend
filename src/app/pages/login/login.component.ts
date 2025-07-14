import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Token } from '../../models/token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formGroup: FormGroup;
  token: Token;
  mensagemDados = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.formGroup = this.formBuilder.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });

    this.token = new Token();
  }

  ngOnInit(): void {
    this.loginService.limparToken()
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.mensagemDados = true;
      const formValue = this.formGroup.value;

      this.loginService.autenticar(formValue.login, formValue.senha).subscribe({
        next: (resposta) => {
          this.token = resposta;
          this.loginService.salvarToken(this.token.accessToken);

          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.mensagemDados = false;
          alert('Login ou senha inválidos.');
        },
        complete: () => {
          this.mensagemDados = false;
        }
      });
    }
  }
}


