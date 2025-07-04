import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-usuario.component.html',
  styleUrl: './add-usuario.component.css'
})
export class AddUsuarioComponent {

  formGroup: FormGroup;
  mensagemErroLogin: string;

  constructor(private formBuilder: FormBuilder, private service: UsuarioService, private route: ActivatedRoute, private router: Router) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required],
      nivelAcesso: ['', Validators.required]
    });

    this.mensagemErroLogin = "";
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.service.salvar(this.formGroup.value).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }


  verificarLogin() {
    const login = this.formGroup.get('login')?.value;
    this.mensagemErroLogin = "";

    this.service.verificarLogin(login).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroLogin = "Login já cadastrado.";
          this.formGroup.get('login')?.setErrors({ loginDuplicado: true });
        } else {
          this.mensagemErroLogin = "";
          // Limpa o erro de loginDuplicado, se existir
          this.formGroup.get('login')?.setErrors(null);
        }
      },
      error: err => {
        this.mensagemErroLogin = "Erro ao validar o login";
      }
    });
  }

}
