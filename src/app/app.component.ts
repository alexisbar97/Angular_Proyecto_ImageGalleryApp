import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './components/gallery/gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GalleryComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-gallery';
}
