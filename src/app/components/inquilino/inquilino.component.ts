import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Inquilino } from 'src/app/interfaces/inquilino';
import { InquilinoService } from 'src/app/services/inquilino.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-inquilino',
  templateUrl: './inquilino.component.html',
  styleUrls: ['./inquilino.component.css']
 })
export class InquilinoComponent implements OnInit {

  lista: Inquilino[] = []
  accion = 'Agregar';
  id: number | undefined;

  nombre: string = '';
  apellido: string = '';
  telefono: number = 0;
  loading: boolean = false;

  //Contructor
  constructor(
    private _inquilinoService: InquilinoService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) { 
 
  }

  ngOnInit(): void {
    this.getLista();
  }

  getLista() {
    this._inquilinoService.getList().subscribe(data => {
      this.lista = data;
    })
  }

  Add(){
    // Validamos que el Inquilino ingrese valores
    if (this.nombre == '' || this.apellido == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }
    
    // Creamos el objeto
    var inquilino:  any = {
      id: (this.id== undefined)?0:this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono
    }

    this.loading = true;
    if(this.id == undefined){
      this._inquilinoService.save(inquilino).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(`El Inquilino ${this.nombre} fue registrado con exito`, 'Inquilino registrado');
          this.resetForm();
          this.getLista();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })
    }else{
     
      this._inquilinoService.update(this.id,inquilino).subscribe({
        next: (v) => {
          this.loading = false;
          this.accion = 'Agregar';
          this.toastr.success(`El Inquilino ${this.nombre} fue Actualizado con exito`, 'Inquilino Actualizado');
          this.resetForm();
          this.getLista();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })


    }

  }

  Update(inquilino: Inquilino){
    this.accion = 'Actualizar';
    this.id = inquilino.id;
    this.nombre = inquilino.nombre,
    this.apellido = inquilino.apellido,
    this.telefono = inquilino.telefono
   }

   Delete(id: number){
    this.loading = true;
    this._inquilinoService.delete(id).subscribe({
      next: (v) => {
        this.toastr.success(`El Inquilino ${this.nombre} fue elimado con exito`, 'Inquilino Eliminado');
        this.getLista();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })

  }

   private resetForm() {
    this.nombre = '';
    this.apellido = '';
    this.telefono = 0;
    this.id = undefined;
  }

}
