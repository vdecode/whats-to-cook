import { Component, effect, signal } from '@angular/core';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  mode = signal<boolean>(false);
  constructor(){
    const raw = localStorage.getItem('dark_mode');
    console.log(raw, 'raw')
    this.mode.set(raw==='1');
    effect(()=>{
      console.log('effect runs')
      const mode = this.mode();
      const el = document.documentElement;
      if(mode) {
        el.classList.add('dark');
        console.log('dark mode set');
       } else {
        el.classList.remove('dark');
        console.log('light mode set');
        localStorage.setItem('dark_mode', mode ? '1': '0');
       } 
    });
  }
  toggle(){ 
    this.mode.update((v)=>!v); 
  }
  
}
