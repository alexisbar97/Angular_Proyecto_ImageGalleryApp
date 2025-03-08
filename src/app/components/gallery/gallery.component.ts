import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PexelsService } from '../../services/pexels.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule], // Importa MatDialogModule
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images: any[] = []; // Array de imágenes
  searchTerm: string = ''; // Término de búsqueda
  isLoading: boolean = false; // Indicador de carga
  hasError: boolean = false; // Indicador de error
  currentPage: number = 1; // Página actual
  totalResults: number = 0; // Total de resultados

  private searchSubject = new Subject<string>(); // Subject para el debounce

  constructor(
    private pexelsService: PexelsService,
    private dialog: MatDialog // Inyecta el servicio MatDialog
  ) { }

  ngOnInit(): void {
    // Configura el debounce
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deje de escribir
      distinctUntilChanged() // Solo emite si el valor cambió
    ).subscribe(term => {
      this.searchTerm = term;
      this.searchImages(); // Llama a la función de búsqueda
    });
  }

  // Método para emitir valores al Subject
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement; // Type assertion
    if (target) {
      this.searchSubject.next(target.value); // Emite el valor al Subject
    }
  }

  // Reinicia la búsqueda cuando el usuario escribe un nuevo término
  searchImages(): void {
    this.currentPage = 1; // Reinicia la página
    this.images = []; // Limpia las imágenes anteriores
    this.loadImages();
  }

  // Carga las imágenes desde la API
  loadImages(): void {
    if (this.searchTerm) {
      this.isLoading = true;
      this.hasError = false;

      this.pexelsService.searchImages(this.searchTerm, this.currentPage).subscribe({
        next: (response: any) => {
          this.images = [...this.images, ...response.photos]; // Agrega nuevas imágenes
          this.totalResults = response.total_results;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching images:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      });
    }
  }

  // Detecta el scroll para cargar más imágenes
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.isLoading || this.images.length >= this.totalResults) {
      return; // Evita cargar más si ya se están cargando imágenes o no hay más resultados
    }

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (windowHeight + scrollTop >= documentHeight - 200) {
      this.currentPage++; // Incrementa la página
      this.loadImages(); // Carga más imágenes
    }
  }

  // Método para abrir el modal
  openModal(image: any): void {
    this.dialog.open(ImageModalComponent, {
      data: image, // Pasa la imagen al modal
      width: '80%', // Ancho del modal
      maxWidth: '800px', // Ancho máximo del modal
    });
  }
}
