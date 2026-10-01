import { afterNextRender, Component, viewChild, DestroyRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(()=>{
      const savedForm =  window.localStorage.getItem('save-login-form');
      if(savedForm){
        const parsedForm = JSON.parse(savedForm);
        const savedEmail = parsedForm.email;
        setTimeout(() => { 
          this.form().controls['email'].setValue(savedEmail)}, 1);
      }

      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) => {
          window.localStorage.setItem('save-login-form', JSON.stringify({email: value.email}))
        }
      }); 
      this.destroyRef.onDestroy(() => {
        subscription?.unsubscribe();
      });
    })
  }

  onSubmit(data: NgForm){
    if(data.invalid){
      return;
    }
    const enteredEmail = data.form.value.email;
    const enteredPassword = data.form.value.password;

    console.log(enteredEmail, enteredPassword);

    data.form.reset();
  }
}

