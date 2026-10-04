import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (!control.value.includes('?')) {
    return { mustContainQuestionMark: true };
  }
  return null;
}
function mustbeUniqueEmail(control: AbstractControl) {
  if (control.value === 'test@example.com') {
    return of({ notUnique: true });
  }
  return of(null);
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('',{
      validators: [Validators.required, Validators.email],
      asyncValidators: [mustbeUniqueEmail]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark],
    })
  });
  destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    const savedEmail = window.localStorage.getItem('save-login-form');
    if(savedEmail) {
      const email = JSON.parse(savedEmail).email;
      this.form.patchValue({ email });
    }

    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem('save-login-form', 
          JSON.stringify({email: value.email})
        );
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log({ enteredEmail, enteredPassword });
  }
}