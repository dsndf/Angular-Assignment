import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideLayoutComponent } from './components/layouts/side-layout/side-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SideLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-assign';
}
