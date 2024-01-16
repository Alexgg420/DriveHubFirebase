import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { CustomTranslateService } from 'src/app/core/services/custom-translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  @Input() user:User | null=null;
  @Input() languages: string[] = ['es', 'en'];
  @Input() languageSelected: string = 'es';
  @Output() onSignout: EventEmitter<void> = new EventEmitter<void>()
  @Output() onProfile: EventEmitter<void> = new EventEmitter<void>()

  constructor(
    private _menu: MenuController,
    private _router: Router,
    private _auth: AuthService,
    private _lang: TranslateService
  ) {}

  ngOnInit(): void {
    this._auth.isLogged$.subscribe((logged) => {
      if (logged) {
        this._auth.me().subscribe((user) => {
          this._user.next(user);
        });
      }
    });
    this._lang.use('es');
  }

  setLanguage(lang: string) {
    this.languageSelected = lang;
    this._lang.use(lang);
  }

  toProfilePage(event: Event) {
    this.onProfile.emit()
  }

  logoutClick(event: Event) {
    this.onSignout.emit()
  }
}