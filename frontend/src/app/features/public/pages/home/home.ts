import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '@app/core/services/user/user';
import { ButtonComponent } from "@app/shared/components/button/button";


@Component({
  selector: 'app-home',
  imports: [RouterModule, ButtonComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly userservice = inject(UserService);
  private readonly router = inject(Router);
  ngOnInit(): void {
    if(this.userservice.isAuth()){
      this.router.navigate(['/onboarding']);
    }
  }

  handleLetsGetStarted(){
    if(this.userservice.isAuth()){
      this.router.navigate(['/onboarding']);
    }else{
      this.userservice.login();
    }
  }

}
