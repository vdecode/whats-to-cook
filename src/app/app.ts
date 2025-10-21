import { Component, effect, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('whats-to-cook');
   mode = signal<boolean>(false);
  constructor(){
    const raw = localStorage.getItem('dark_mode');
    console.log(raw, 'raw')
    this.mode.set(raw==='1');
    effect(()=>{
      console.log('effect run')
      const m = this.mode();
      const el = document.documentElement;
      if(m) {
        el.classList.add('dark');
        console.log('dark mode set');
       } else {
        el.classList.remove('dark');
        console.log('light mode set');
        localStorage.setItem('dark_mode', m?'1':'0');
       } 
    });
  }
  toggle(){ 
    this.mode.update(v=>!v); 
  }
  
}
