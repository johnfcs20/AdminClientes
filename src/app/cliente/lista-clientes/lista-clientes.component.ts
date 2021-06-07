import { direccionLista } from './../../modelos/direccionLista';
import { logging } from 'protractor';
import { clienteService } from './cliente.service';
import { clienteLista } from './../../modelos/clienteLista';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  
  public crudCliente!: FormGroup;

  public crudDireccionesCliente!: FormGroup;


  clientesLista: any[] = [];
  direccionesClienteLista: any[] =[];
  public idCliente: string = "";
   public idDireccion: string = "";
  public loading: boolean = false;
  public loadingModal: boolean = false;

  constructor(private _service: clienteService, private toastr: ToastrService, private fb: FormBuilder, ) { }

  ngOnInit(): void {

    this.listaClientes();
    this.createForm();

  }

  createForm() {
  /*<summary>
     Este metodo se einicializar los formularios que seran utilizados en el componente
  </summary>*/
    this.crudCliente = this.fb.group({
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required]
    });

    this.crudDireccionesCliente = this.fb.group({
      direccion: ["", Validators.required]
    });
  }


  listaClientes(){
   /*<summary>
     Este metodo se encarga de conectarse con el metodo en el servicio que retorna la lista de clientes
  </summary>*/
    this.loading = true;
    this._service.listaClientes().subscribe(res => {
           this.clientesLista = [];
      res.forEach(element => {
          this.clientesLista.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data() //sprit operator
        });
      });
      this.loading = false;
    });
  }


  detalleCliente(idCliente: string){
  // <param name = "idCliente"> Numero que identifica al cliente en la lista </param>
  /*<summary>
     Este metodo se encarga de conectarse con el metodo en el servicio que retorna el detalle de un cliente en especificio
  </summary>*/
  
    this._service.detalleCliente(idCliente).subscribe((resp) => {
      this.idCliente = resp.payload.data()["idNumber"];
      this.crudCliente.setValue({
        nombres: resp.payload.data()["nombres"],
        apellidos: resp.payload.data()["apellidos"],
      });
    });
  }

  guardarClientes(){
  /*<summary>
     Este metodo se encarga de conectarse con el metodo en el servicio que almacena un cliente/actualiza un cliente.
  </summary>*/
    this.loading = true;

      setTimeout(() => {
    const cliente: clienteLista = {
      nombres: this.crudCliente.controls["nombres"].value,
      apellidos: this.crudCliente.controls["apellidos"].value
    }

    this._service.guardarCliente(cliente,  this.idCliente);
    this.toastr.success('Cliente guardado correctamente');
    this.limpiarForm();
    this.loading = false;
       }, 1000);

  }

  eliminarCliente(idCliente: string) {
  // <param name = "idCliente"> Numero que identifica al cliente en la lista </param>
  /*<summary>
     Este metodo se encarga de conectarse con el metodo en el servicio elimina un cliente.
  </summary>*/
    this.loading = true;
    setTimeout(() => {
        this._service.eliminarCliente(idCliente) ;
        this.toastr.success('Cliente eliminado correctamente');
        this.loading = false;
    }, 1000);
  }

  limpiarForm(){
  /*<summary>
     Este metodo se encarga de limpiar el formulario que alamcena los datos de un cliente.
  </summary>*/
    setTimeout(() => {
      this.idCliente = "";
      this.crudCliente.reset();
    }, 50);
  }

  asignarIdCliente(id: string){
  /*<summary>
     Este metodo se encarga de limpiar el formulario que alamcena los datos de un cliente.
  </summary>*/
    this.idCliente = id;
  }


  editarDireccion( descipcion: string, id: string){
  // <param name = "descipcion"> cadena de caracteres que detallan la direccion </param>
  // <param name = "id"> Numero que identifica la direccion en el arreglo </param>
  /*<summary>
     Este metodo se inicializar los parametros para la edicion de una direccion
  </summary>*/
    this.crudDireccionesCliente.setValue({
      direccion: descipcion
    });
    this.idDireccion = id;
  }

  
  guardarDirecciones(){
  /*<summary>
     Este metodo se encarga de llamar al metodo en el servicio que almacena/actualiza una direccion
  </summary>*/
    const direccionCliente: direccionLista = {
      descripcion: this.crudDireccionesCliente.controls["direccion"].value
    }

    this.loadingModal = true;

    setTimeout(() => {
      this._service.guardarDireccion( direccionCliente,  this.idCliente, this.idDireccion);
      this.toastr.success('Direccion Guardada correctamente');
      this.limpiarFormularioDirecciones();

      this.loadingModal = false;

    }, 1000);
  }


  listaDireccionesClientes(idCliente: string){
  // <param name = "idCliente"> Numero que identifica la direccion en el arreglo </param>
  /*<summary>
     Este metodo se encarga de llamar al metodo en el servicio que trae la lista de direcciones asociadas a un cliente
  </summary>*/
    this.loadingModal = true;
    setTimeout(() => {
      this.idCliente = idCliente;
      this._service.lsitaDirecciones(idCliente).subscribe((res: any) =>  {
          this.direccionesClienteLista = res;
      });
    this.loadingModal = false;
    }, 1000);
  }


  eliminarDireccion(idDireccion: string){
  // <param name = "idDireccion"> Numero que identifica la direccion en el arreglo </param>
  /*<summary>
     Este metodo se encarga de llamar al metodo en el servicio que elimina la direccion de un cliente
  </summary>*/
    this.loadingModal = true;
    setTimeout(() => {
      this._service.eliminarDireccion(this.idCliente, idDireccion);
      this.toastr.success('Direccion eliminada correctamente');
      this.loadingModal = false;
    }, 1000);
  }

  limpiarFormularioDirecciones(){
  /*<summary>
     Este metodo se encarga de limpiar el formulario encargado de almacenar los datos de direcciones de un cliente.
  </summary>*/
    setTimeout(() => {
      this.crudDireccionesCliente.reset({});
      this.idDireccion = "";
    }, 50);
  }

}