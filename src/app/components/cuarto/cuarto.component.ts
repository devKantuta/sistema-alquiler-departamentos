import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Cuarto } from 'src/app/interfaces/cuarto';
import { CuartoService } from 'src/app/services/cuarto.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-cuarto',
  templateUrl: './cuarto.component.html',
  styleUrls: ['./cuarto.component.css']
})
export class CuartoComponent implements OnInit {

  listCuarto: Cuarto[] = []
  accion = 'Agregar';
  id: number | undefined;

  numero: string = '';
  descripcion: string = '';
  dimension: string = '';
  costo: number | undefined;
  loading: boolean = false;

  //Contructor
  constructor(
    private _cuartoService: CuartoService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) { 
 
  }

  ngOnInit(): void {
    this.getCuartos();
  }

  getCuartos() {
    this._cuartoService.getCuartos().subscribe(data => {
      this.listCuarto = data;
    })
  }

  addCuarto(){
    // Validamos que el Cuarto ingrese valores
    if (this.numero == '' || this.dimension == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }
    
    // Creamos el objeto
    var cuarto:  any = {
      id: (this.id== undefined)?0:this.id,
      numero: this.numero,
      descripcion: this.descripcion,
      dimension: this.dimension,
      costo: this.costo,
    }

    this.loading = true;
    if(this.id == undefined){
      this._cuartoService.saveCuarto(cuarto).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(`El Cuarto ${this.numero} fue registrado con exito`, 'Cuarto registrado');
          this.resetForm();
          this.getCuartos();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })
    }else{
     
      this._cuartoService.updateCuarto(this.id,cuarto).subscribe({
        next: (v) => {
          this.loading = false;
          this.accion = 'Agregar';
          this.toastr.success(`El Cuarto ${this.numero} fue Actualizado con exito`, 'Cuarto Actualizado');
          this.resetForm();
          this.getCuartos();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })


    }

  }

  UpdateCuarto(cuarto: Cuarto){
    this.accion = 'Actualizar';
    this.id = cuarto.id;
    this.numero = cuarto.numero,
    this.descripcion = cuarto.descripcion,
    this.dimension = cuarto.dimension,
    this.costo = cuarto.costo
   }

   DeleteCuarto(id: number){
    this.loading = true;
    this._cuartoService.deleteCuarto(id).subscribe({
      next: (v) => {
        this.toastr.success(`El Cuarto ${this.numero} fue elimado con exito`, 'Cuarto Eliminado');
        this.getCuartos();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })

  }

   private resetForm() {
    this.numero = '';
    this.descripcion = '';
    this.dimension = '';
    this.costo = 0;
    this.id = undefined;
  }

}
