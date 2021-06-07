import { direccionLista } from './../../modelos/direccionLista';
import { clienteLista } from './../../modelos/clienteLista';
import {Injectable} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { promise } from 'selenium-webdriver';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class clienteService {


  constructor(private readonly afs: AngularFirestore){}


  listaClientes(): Observable<any> {
  /*<summary>
     Este metodo se encarga traer una lista de clientes registrados en la BD
  </summary>*/
    return   this.afs.collection('clientes').snapshotChanges();
  }

  guardarCliente(cliente: clienteLista, id: string): Promise<any> {
  // <param name = "cliente"> Objeto tipo cliente que almcena los campos necesarios para insertar el nuevo registro </param>
  // <param name = "id"> Numero que identifica un cliente registrado en la BD </param>
  /*<summary>
     Este metodo se encarga de almacenar un nuevo cliente en la BD.
  </summary>*/

     const idNumber = id || this.afs.createId();
     const data = {idNumber, ...cliente}
     var response;
     if(id === ""){
       response = this.afs.collection('clientes').doc(idNumber).set(data);
     }
     if (id != ""){
       response = this.afs.collection('clientes').doc(idNumber).update(data);
     }
    return response;

  }

  eliminarCliente( id: string): Promise<any> {
  // <param name = "id"> Numero que identifica un cliente registrado en la BD </param>
  /*<summary>
     Este metodo se encarga de almacenar eliminar en la BD el registro asociado al ID.
  </summary>*/

     return this.afs.collection('clientes').doc(id).delete();



  }

  detalleCliente(idCLiente: string): Observable<any>{
  // <param name = "idCLiente"> Numero que identifica un cliente registrado en la BD </param>
  /*<summary>
     Este metodo se encarga de retornar el detalle de un cliente en especifico.
  </summary>*/
   return   this.afs.collection('clientes').doc(idCLiente).snapshotChanges();
  }


  lsitaDirecciones(idCLiente: string): Observable<any>{
  // <param name = "idCLiente"> Numero que identifica un cliente registrado en la BD </param>
  /*<summary>
     Este metodo se encarga de retornar una lista de direcciones asociadas a un cliente.
  </summary>*/
    return this.afs.collection('clientes').doc(idCLiente).collection('direcciones').snapshotChanges().pipe(
      map( snapshot => snapshot.map( doc => ({
        direccion_id: doc.payload.doc.id,
        ...doc.payload.doc.data() as any
        })))); 
  }


  guardarDireccion(direccion: any, IdCliente: string, idDireccion: string): Promise<any> {
  // <param name = "direccion"> Objeto que almacena los datos de la direccion que se van a insertar </param>
  // <param name = "IdCliente"> Numero unico que identifica al cliente </param>
  // <param name = "idDireccion"> Numero unico que identifica la direccion asociada al cliente </param>
  /*<summary>
     Este metodo se encarga alamcenar/actualizar una direccion asociada a un cliente.
  </summary>*/

     const idNumber = idDireccion || this.afs.createId();
     const data = {idNumber, ...direccion}

      var response;
         if(idDireccion === ""){
           response = this.afs.doc(`clientes/${ IdCliente }`).collection('direcciones').add(data);
         }
         if (idDireccion != ""){
           response = this.afs.collection('clientes').doc(IdCliente).collection('direcciones').doc(idDireccion).update(data);
         }
      return response;
  }

  eliminarDireccion(idCLiente: string, idDireccion: string){
  // <param name = "IdCliente"> Numero unico que identifica al cliente </param>
  // <param name = "idDireccion"> Numero unico que identifica la direccion asociada al cliente </param>
  /*<summary>
     Este metodo se encarga eliminar una direccion asociada a un cliente.
  </summary>*/
    return this.afs.collection('clientes').doc(idCLiente).collection('direcciones').doc(idDireccion).delete();
  }

 


}
