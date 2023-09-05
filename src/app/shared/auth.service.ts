import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>; // Observable przechowujący informacje o użytkowniku

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.user$ = fireauth.user; // Inicjalizacja Observable z danymi o użytkowniku
  }

  // Metoda do logowania
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        localStorage.setItem('token', 'true');

        if (res.user.emailVerified) {
          this.router.navigate(['/homepage']);
        } else {
          this.router.navigate(['/verify-email']);
        }
      },
      (err) => {
        alert('Coś poszło nie tak');
        this.router.navigate(['/login']);
      }
    );
  }

  // Metoda do rejestracji
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert('Rejestracja się powiodła');
        this.router.navigate(['/login']);
        this.sendEmailForVerification(res.user);
      },
      (err) => {
        alert('Coś poszło nie tak');
        this.router.navigate(['/registration']);
      }
    );
  }

  // Metoda do wylogowania
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/homepage']);
      },
      (err) => {
        alert('Coś poszło nie tak');
      }
    );
  }

  // Metoda do przypomnienia hasła
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/verify-email']);
      },
      (err) => {
        alert('Coś poszło nie tak');
      }
    );
  }

  // Metoda do wysyłania emaila weryfikacyjnego
  sendEmailForVerification(user: any) {
    user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/verify-email']);
      },
      (err: any) => {
        alert('Coś poszło nie tak. Nie mogę wysłać emaila');
      }
    );
  }
}
