import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signOut } from '@firebase/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;

  constructor(
		private fb: FormBuilder,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private authService: AuthService,
		private router: Router,
    private auth: Auth
  ) { }

	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}

	ngOnInit() {
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]]
		});
	}

	async register() {
		const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.register(this.credentials.value);
		await loading.dismiss();

		if (user) {
			this.router.navigateByUrl('/medicamentos', { replaceUrl: true });
		} else {
			this.showAlert('El registro a fallado', 'Por favor, inténtalo de nuevo');
		}
	}

	async login() {
		const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.login(this.credentials.value);
		await loading.dismiss();

		if (user) {
			this.router.navigateByUrl('/medicamentos', { replaceUrl: true });
		} else {
			this.showAlert('El usuario o la contraseña no es correcta', 'Por favor, inténtalo de nuevo');
		}
	}

	async showAlert(header: any, message: string) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}

  logout(){
    return signOut(this.auth);
  }

}
