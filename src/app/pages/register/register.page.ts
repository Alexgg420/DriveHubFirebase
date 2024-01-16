import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { AuthService } from 'src/app/core/services/api/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  register(registerInfo: UserRegisterInfo) {
    this.auth.register(registerInfo).subscribe({
      next: (data) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
      },
    });
  }

  navigateLogin() {
    this.router.navigate(['/login']);
  }
}