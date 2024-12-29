import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Pago } from 'src/app/interfaces/pago';
import { ErrorService } from 'src/app/services/error.service';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html'
})
export class PagoComponent implements OnInit {

  lista: Pago[] = []

  constructor(  
    private PagoService: PagoService,
    private _errorService: ErrorService
  ) {  
   }

  ngOnInit(): void {
    this.getLista();
  }

  getLista() {
    this.PagoService.getList().subscribe(data => {
      this.lista = data;
    })
  }

  VerPDFPago(id:number):void{
    this.PagoService.PDFpago(id).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Calcular las dimensiones de la ventana
        const width = 800; // Ancho de la ventana
        const height = 600; // Alto de la ventana
        const left = (window.screen.width - width) / 2; // Calcular la posición izquierda para centrar
        const top = (window.screen.height - height) / 2; // Calcular la posición superior para centrar
        
        // Abrir el PDF en una nueva ventana centrada horizontalmente
        const newWindow = window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
        
        if (!newWindow) {
          // Controlar el caso en que el navegador bloquee la apertura de ventanas emergentes
          alert('Por favor, habilite las ventanas emergentes para ver el PDF.');
        }
      },
      error: (e: HttpErrorResponse) => {
        
        this._errorService.msjError(e);
      }
    })
  }
}