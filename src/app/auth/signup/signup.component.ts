import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControl } from '@angular/forms';

function passwordsMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordsMismatch: true };
  } 
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('',{
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup({
      password: new FormControl('',{
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('',{
        validators: [Validators.required, Validators.minLength(6)],
      })
    },{
      validators: [passwordsMatchValidator]
    }),
    firstName: new FormControl('',{
      validators: [Validators.required],
    }),
    lastName: new FormControl('',{
      validators: [Validators.required],
    }),
    address: new FormGroup({
      street: new FormControl('',{
        validators: [Validators.required],
      }),
      number: new FormControl('',{
        validators: [Validators.required],
      }),
      postal: new FormControl('',{
        validators: [Validators.required],
      }),
      city: new FormControl('',{
        validators: [Validators.required],
      }),
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student',{
      validators: [Validators.required],
    }),
    agree: new FormControl<boolean>(false,{
      validators: [Validators.requiredTrue],
    }),
    source: new FormArray([
      new FormControl<boolean>(false),
      new FormControl<boolean>(false),
      new FormControl<boolean>(false),
    ])
  });

  onSubmit() {
    if(this.form.invalid) {
      console.log("INVALID FORM");
      return;
    }
    console.log(this.form.value);
  }

  onReset() {
    this.form.reset();
  }
}
