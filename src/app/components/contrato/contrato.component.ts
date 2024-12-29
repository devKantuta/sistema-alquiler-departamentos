import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Contrato } from 'src/app/interfaces/contrato';
import { ContratoService } from 'src/app/services/contrato.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { Cuarto } from 'src/app/interfaces/cuarto';
import { Inquilino } from 'src/app/interfaces/inquilino';
import { CuartoService } from 'src/app/services/cuarto.service';
import { InquilinoService } from 'src/app/services/inquilino.service';
import { lastValueFrom } from 'rxjs';
declare var $: any; // Declara la variable global jQuery

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {
  @ViewChild('myModal') myModal!: ElementRef;

  lista: Contrato[]| undefined = [];
  listCuarto: Cuarto[] = []
  listInquilino: Inquilino[] = []
  accion = 'Agregar';
  loading: boolean = false;
  id: number | undefined;

  fecha_inicio: string = '';
  fecha_fin: string = '';
  estado: boolean= true;
  mesesadelanto: number=0;
  pagoadelanto: number=0;
  id_inquilino:number = 0;
  id_cuarto: number= 0;
  id_cuartoAuxiliar: number= 0;

  //adicionales
  costoMensualCuarto :number = 0;

  constructor(
    private _contratoService: ContratoService,
    private _cuartoService: CuartoService,
    private _inquilinoService: InquilinoService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.CargarFechas();
    this.ActualizarContratos();
    this.getCuartos();
    this.getInquilinos();
  }


  CargarFechas(){
    const today = new Date();
    this.fecha_inicio = today.toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
    this.fecha_fin = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
  }

  async ActualizarContratos(){
    try {
      var fechaFin = new Date();

      this.lista = await lastValueFrom(this._contratoService.getList()) ?? [];
      console.log(this.lista);
      
      var estadocontrato: any = { estado: false }
      var estadocuarto: any = { estado: true }
      for (var contrato of this.lista!) {
       
        fechaFin = new Date(contrato.fecha_fin);
        fechaFin.setDate(fechaFin.getDate() + 1);
  
        if(fechaFin < new Date() && contrato.estado==true){
          await lastValueFrom(this._contratoService.updateEstado(contrato.id, estadocontrato)) ;
          await lastValueFrom(this._cuartoService.updateEstado(contrato.id_cuarto, estadocuarto)) ;
        }
      }
      this.getLista();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }
  getLista() {
    this._contratoService.getList().subscribe(data => {
      this.lista = data;
    })
  }
  getCuartos(){
    this._cuartoService.getCuartos().subscribe(data => {
      this.listCuarto = data;
    })
  }

  getInquilinos(){
    this._inquilinoService.getList().subscribe(data => {
      this.listInquilino = data;
    })
  }

  AbrirModal(){
    this.accion = 'Agregar';
    this.resetForm();
    this.openModal();
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.id_cuarto = parseInt(selectElement.value);
    let costo = this.listCuarto.find(x=>x.id==this.id_cuarto)?.costo
    this.costoMensualCuarto = costo!;
  }
  //Calcular monto de anticipo
  CalculaMontAntipo(){
    this.pagoadelanto = this.costoMensualCuarto*this.mesesadelanto;


    let fechaInicio = new Date(this.fecha_inicio);
    fechaInicio.setDate(fechaInicio.getDate() + 1); // Ajustar inicio al día siguiente para evitar duplicados
    let fechaFin = new Date(this.fecha_fin);
    fechaFin.setDate(fechaFin.getDate() + 1);

    const diffInMonths = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth());
    console.log(fechaInicio)
    console.log(fechaFin)
    if (this.mesesadelanto > diffInMonths) {
      this.toastr.error('La cantidad de meses ingresada no está dentro del rango de fechas', 'Error');
    }

  }
  onInputChange(event: any): void {
    this.CalculaMontAntipo()
  }

  Add(){
    // Validamos que el Contrato ingrese valores
    if (this.fecha_fin == null || this.fecha_fin == null || this.pagoadelanto == null || 
        this.id_inquilino == 0 || this.id_cuarto == 0 
    ) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }else{
      var fechaFinal = new Date(this.fecha_fin);
      fechaFinal.setDate(fechaFinal.getDate() + 1);
      if (fechaFinal <= new Date()){
        this.toastr.error('La fecha Fin invalida', 'Error');
        return;
      }
    }
    
    // Creamos el objeto
    var contrato:  Contrato = {
      id: (this.id== undefined)?0:this.id,
      fecha_inicio: this.fecha_inicio,
      fecha_fin: this.fecha_fin,
      estado: this.estado,
      mesesadelanto: this.mesesadelanto,
      pagoadelanto: this.pagoadelanto,
      id_cuarto: this.id_cuarto,
      id_inquilino: this.id_inquilino
    }

    this.loading = true;
    if(this.id == undefined){
      this._contratoService.save(contrato).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(`El Contrato fue registrado con exito`, 'Contrato registrado');
          this.resetForm();
          this.closeModal();
          this.getLista();
          this.getCuartos();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })
    }else{
     
      this._contratoService.update(this.id,contrato).subscribe({
        next: (v) => {
          this.loading = false;
          this.accion = 'Agregar';
          this.toastr.success(`El Contrato con ID ${this.id} fue Actualizado con exito`, 'Contrato Actualizado');
          var id_cuartonuevo=this.id_cuarto;
          if(this.id_cuarto!=this.id_cuartoAuxiliar){
            var contrato: any = { estado: true }
            
            this._cuartoService.updateEstado(this.id_cuartoAuxiliar, contrato).subscribe({
              next: (res) => {
                contrato.estado=false;
                this._cuartoService.updateEstado(id_cuartonuevo, contrato).subscribe({
                  next: (res) => {
                    this.getCuartos();
                  },
                  error: (e: HttpErrorResponse) => {
                    this.loading = false;
                  }
                });
              },
              error: (e: HttpErrorResponse) => {
                this.loading = false;
              }
            });
          }
    
          this.resetForm();
          this.closeModal();
          this.getLista();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })


    }

  }

  Update(contrato: Contrato){
    this.accion = 'Actualizar',
    this.id = contrato.id,
    this.fecha_inicio = contrato.fecha_inicio.split('T')[0],
    this.fecha_fin = contrato.fecha_fin.split('T')[0],
    this.estado = contrato.estado,
    this.pagoadelanto = contrato.pagoadelanto,
    this.id_cuarto = contrato.id_cuarto,
    this.id_cuartoAuxiliar=contrato.id_cuarto,
    this.id_inquilino = contrato.id_inquilino
    //variables adicionales
    this.costoMensualCuarto = contrato.cuarto?.costo!,
    this.mesesadelanto = contrato.mesesadelanto,
    this.pagoadelanto = contrato.pagoadelanto
    this.openModal();
   }

   Delete(item: any){
    this.loading = true;
    
    this._contratoService.delete(item.id).subscribe({
      next: (v) => {
        this.toastr.success(`El Contrato con ID ${item.id} fue elimado con exito`, 'Contrato Eliminado');
        var contrato: any = { estado: true }
          this._cuartoService.updateEstado(item.id_cuarto, contrato).subscribe({
            next: (res) => {
              this.toastr.success('El estado del cuarto se actualizó correctamente', 'Estado Actualizado');
            },
            error: (e: HttpErrorResponse) => {
              this.toastr.error('Hubo un error al actualizar el estado del cuarto', 'Error');
              this.loading = false;
            }
          });
        this.getLista();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })

  }

  //Funcion para generar PDF contrato
  VerPDFContrato(item:any){
    this._contratoService.PDFcontrato(item.id).subscribe({
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
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }

   private resetForm() {
    this.id = undefined;
    this.id_cuarto = 0;
    this.id_inquilino = 0;
    this.costoMensualCuarto = 0;
    this.mesesadelanto = 0;
    this.pagoadelanto = 0;
    this.CargarFechas();
  }

  // Método para abrir el modal
  openModal() {
    $('#myModal').modal('show');
  }

  // Método para cerrar el modal
  closeModal() {
    $('#myModal').modal('hide');
  }

}
