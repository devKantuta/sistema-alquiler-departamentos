import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { Contrato } from 'src/app/interfaces/contrato';
import { Deuda } from 'src/app/interfaces/deuda';
import { DeudaService } from 'src/app/services/deuda.service';
import { DatePipe } from '@angular/common';
import { PagoService } from 'src/app/services/pago.service';
import { lastValueFrom } from 'rxjs';
declare var $: any; // Declara la variable global jQuery

@Component({
  selector: 'app-deuda',
  templateUrl: './deuda.component.html',
  styleUrls: ['./deuda.component.css'],
   providers: [DatePipe]
})
export class DeudaComponent implements OnInit {

  @ViewChild('myModal') myModal!: ElementRef;
  private usuario:any = jwtDecode(localStorage.getItem('token')!)??'';
  pipe = new DatePipe('es-BO');

  listaDeuda: Deuda[] = [];
  listaContrato: Contrato[]| undefined = [];
  listaContratoFiltro: Contrato[]| undefined = [];

  accion = 'Agregar';
  loading: boolean = false;
  id: number | undefined;

  //Datos Deuda
  id_dueda: number = 0;
  monto_deuda: number = 0;
  fecha: string  | undefined= '';
  mes: number = 0;
  estado: boolean = false;
  id_contrato: number = 0;

  //Variables Adicionales
  gestion: number = 0;
  tipo_pago: string = '';

  // parametro
  actualizarAFecha: string= ''; // Formato YYYY-MM-DD

  constructor(
    private _contratoService: ContratoService,
    private _deudaService: DeudaService,
    private _pagodeudaService: PagoService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private datePipe: DatePipe
  ) { }

  //funcion que se ejecuta al entrar al programa
  ngOnInit(): void {
    this.GetListaContratos();
    this.getListaDeudas();
    const today = new Date();
    console.log(this.usuario);
    today.setDate(today.getDate());
    this.actualizarAFecha = today.toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
  }
  async GetListaContratos(){
    this._contratoService.getList().subscribe(data => {
      this.listaContratoFiltro = data;
    })
  }

  async getListaDeudas() {

    if(this.id_contrato===0){
      await this._deudaService.getList().subscribe(data => {
        this.listaDeuda = data;
       });
    }else{
      await this._deudaService.getListporContrato(this.id_contrato).subscribe(data => {
        this.listaDeuda = data;
       });
    }

  }
  
  //Eventos:
  async onSelectChange(event: Event): Promise<void> {
    const selectElement = event.target as HTMLSelectElement;
    this.id_contrato = parseInt(selectElement.value);
    await this.getListaDeudas();

    if(this.id_contrato===0){
      this.listaContrato= await lastValueFrom(this._contratoService.getList()); // Obtener la lista de contratos de manera síncrona
    }else{
      this.listaContrato = await lastValueFrom(this._contratoService.getContrato(this.id_contrato)); 
    }
  }
  
  async actualizarDeudas() {
    try {
      if(this.id_contrato !=0){
      // Iterar sobre cada contrato y registrar las deudas mensuales
      for (var contrato of this.listaContrato!) {
        if(contrato.estado==true){ //contratos vigentes
          await this.registrarDeudasMensuales(contrato); // Esperar a que se registren todas las deudas del contrato
        }
      }
        
      // Después de completar el registro de deudas, obtener la lista de deudas
      this.getListaDeudas();
      }else{
        this.toastr.error('Seleccione un Contrato, Por favor.', 'Error');
      }

    } catch (error) {
      console.error('Error al obtener la lista de contratos:', error);
    }
  }

  async registrarDeudasMensuales(contrato: Contrato) {
    try {
      let fechaInicio = new Date(contrato.fecha_inicio);
      fechaInicio.setDate(fechaInicio.getDate() + 1); // Ajustar inicio al día siguiente para evitar duplicados
      let fechaFin = new Date(contrato.fecha_fin);
      fechaFin.setDate(fechaFin.getDate() + 1);
      const fechasDeCobro = await this.calcularFechasDeCobro(fechaInicio, fechaFin);
      console.log('fechas de cobro:',fechasDeCobro,fechaInicio,fechaFin)

      //Fecha de actualizacion
      let fechaFinActualizacion =new Date(this.actualizarAFecha);
      fechaFinActualizacion.setDate(fechaFinActualizacion.getDate() + 1);

      for (const fecha of fechasDeCobro) {
      
         if (this.listaDeuda.filter(x => { const fechaDeuda = new Date(x.fecha);
                                             return fechaDeuda.getFullYear() === fecha.getFullYear() &&
                                                    fechaDeuda.getMonth() === fecha.getMonth() &&
                                                    fechaDeuda.getDate() === fecha.getDate();}).length === 0) {
      
              if (fecha <= fechaFinActualizacion) {
              let mes = fecha.getMonth() + 1; // Mes en base 1
              let deuda: Deuda = {
                id: 0, // El id será generado por la base de datos
                monto_deuda: this.calcularMontoDeuda(contrato),
                mes: mes,
                fecha: fecha,
                estado: false, // Asumiendo que la deuda es pendiente
                id_contrato: contrato.id,
                id_usuario:this.usuario.id
              };
      
              await this._deudaService.save(deuda).toPromise(); // Esperar a que se guarde la deuda
              console.log('Deuda registrada:', deuda);
            }
          }

      }
    } catch (error) {
      console.error('Error al registrar las deudas mensuales:', error);
    }
  }


  calcularMontoDeuda(contrato: Contrato): number {
   
    if (contrato.cuarto && contrato.cuarto.costo) {
      return contrato.cuarto.costo;
    } else {
      return 0; // Manejo del caso en que no haya información del cuarto
    }
  }

  calcularFechasDeCobro(fechaInicio: Date, fechaFin: Date): Date[] {
    // Reiniciar el arreglo de fechas
    let fechasDeCobro: Date[] = [];
    // Crear una copia de la fecha de inicio para no modificar la original
    let fechaActual = new Date(fechaInicio);
    var sw=false;
    let fechaSiguienteMes;

    // Iterar hasta que la fecha actual llegue al mes de la fecha de fin
    while (fechaActual <= fechaFin) {

        // Agregar la fecha actual al arreglo
        fechasDeCobro.push(new Date(fechaActual));

        // Si estamos en el mes de fin, salimos del bucle
        if (fechaActual.getMonth() === fechaFin.getMonth()+1 && fechaActual.getFullYear() === fechaFin.getFullYear()) {
          break;
        }

        if(fechaActual.getMonth()+1===1){
          if(fechaActual.getDate()===31 || fechaActual.getDate()==30){
            fechaActual= this.obtenerUltimaFechaFebrero(fechaActual.getFullYear(),1);
            sw=true;
            continue
          }
        }

        fechaActual.setMonth(fechaActual.getMonth() + 1);
        if(sw){
          fechaActual.setDate(30);
          sw=false;
        }
  
    }
    return fechasDeCobro;
  }

  obtenerUltimaFechaFebrero(anio: number, mes: number): Date {
    if (mes !== 1) {
        throw new Error("El mes proporcionado no es febrero.");
    }
    return new Date(anio, 2, 0);
  }
  Delete(id: number){
    this.loading = true;
    this._deudaService.delete(id).subscribe({
      next: (v) => {
        this.toastr.success(`El Deuda con ID ${this.id} fue elimado con exito`, 'Deuda Eliminado');
        this.getListaDeudas();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }
  
  Abrir(deuda: Deuda){
    this.openModal();
    this.accion = 'Pago',
    this.id = deuda.id,
    this.monto_deuda = deuda.monto_deuda,
    this.fecha = this.datePipe.transform(new Date(deuda.fecha), 'yyyy-MM-dd') ?? ''
    this.mes = deuda.mes,
    this.gestion =  parseInt(this.datePipe.transform(new Date(deuda.fecha), 'yyyy')??'')
    this.estado = deuda.estado,
    this.tipo_pago = "0",
    this.id_contrato = deuda.id_contrato
   }

   AddPago(){
    if (this.tipo_pago == "0" || this.monto_deuda == 0) {
      this.toastr.error('El tipo de pago es requerido!', 'Error');
      return;
    }

    var pago:  any = {
      id:0,
      fecha: this.fecha,
      mes: this.mes,
      monto_pagado: this.monto_deuda,
      metodo_pago: this.tipo_pago,
      adelanto: "0",
      id_deuda: this.id,
      id_user:this.usuario.id
    }
    var estado_deuda: any = { estado: true }

    this._pagodeudaService.save(pago).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(`La deuda ${this.mes}-${this.gestion} fue cancelada con exito`, 'Pago registrado');
 
         this._deudaService.updateEstado(this.id!, estado_deuda).subscribe({
           next: (res) => {
             this.getListaDeudas();
             this.closeModal();
           },
           error: (e: HttpErrorResponse) => {
             this.toastr.error('Hubo un error al actualizar el estado del cuarto', 'Error');
             this.loading = false;
           }
         });
       
        // this.resetForm();
      
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
    this.getListaDeudas();
   }

  VerPDF(id:number):void{
    
    this._deudaService.VerPdf(id).subscribe({
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

    // Método para abrir el modal
  openModal() {
    $('#myModal').modal('show');
  }
      // Método para cerrar el modal
  closeModal() {
    $('#myModal').modal('hide');
  }
}
