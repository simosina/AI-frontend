import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required, Validators.email]
  });
  password = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required, Validators.minLength(6)]
  });

  loading = false;
  loginError = false;
  redirectUrl: string;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.redirectUrl = this.route.snapshot.queryParams['redirect_to'] || '/';

    // redirect to redirectUrl if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.redirectUrl]);
    }
  }

  ngOnInit(): void {
  }

  register() {
    //console.log("email: " + this.email.value);
    //console.log("pass: " + this.password.value);
    if(!this.email.invalid && !this.password.invalid){
      this.loading = true;

      this.authService.registerUser(this.email.value, this.password.value)
                      .subscribe(
                        suc => {
                          //console.dir("LoginComponent - .subscribe (success) - result.accessToken: " + suc.accessToken);
                          this.router.navigate([this.redirectUrl]);
                        },
                        err => {
                          //console.dir(".subscribe (error) - result.accessToken: " + err.accessToken);
                          this.loading = false;
                          this.loginError = true;
                          this.password.reset();
                        }
                      );
    } else {
      this.email.markAsTouched({onlySelf: true});
      this.password.markAsTouched({onlySelf: true});
    }
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    } else if(this.email.hasError('email')) {
      return 'Email is invalid';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    } else if(this.password.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  }

}