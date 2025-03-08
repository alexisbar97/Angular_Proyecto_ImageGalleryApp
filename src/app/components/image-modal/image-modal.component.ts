import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule], // Importa módulos necesarios
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
