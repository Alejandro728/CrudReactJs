import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModelHeader } from 'reactstrap';
import React,{ useState, useEffect } from 'react';


function App() {
const baseUrl= "http://localhost:5193/clientControllers";
const [data, setData]=useState([]);
const [modalEditar, setModalEditar] =useState(false);
const [modalInsertar, setModalInsertar] =useState(false);
const [modalEliminar, setModalEliminar] = useState(false);

const [gestorSeleccionado, setGestorSeleccionado]=useState({
  id: 0,
  nombre: '',
  direccion: '',
  telefono: '',
  identificador: '',
  fechaCreacion: '',
  correo:''
})

const handleChange=e=>{
  const {name, value} =e.target;
  setGestorSeleccionado({
    ...gestorSeleccionado,
    [name]:value
  });
  console.log(gestorSeleccionado);
}


const abrirCerrarModalInsertar=()=>{
  setModalInsertar(!modalInsertar);
}


const abrirCerrarModalEditar=()=>{
  setModalEditar(!modalEditar);
}

const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
}


const peticionesGet= async () => { 
  try {
    const response = await axios.get(baseUrl);
    setData(response.data);
  } catch (error) {
    console.log(error);
  }
}



const peticionesPost= async () => { 
  delete gestorSeleccionado.id;
  await axios.post(baseUrl, gestorSeleccionado)
  .then(response=>{
    setData(data.concat(response.data));
    abrirCerrarModalInsertar();
  }).catch(error=>{
    console.log(error);
  })
}

const peticionesPut= async () => { 
  await axios.put(`${baseUrl}/${gestorSeleccionado.id}`, gestorSeleccionado)
  .then(response=>{
    var respuesta =response.data;
    var dataAuxiliar=data;
    dataAuxiliar.map(gestor=>{
      if(gestor.id===gestorSeleccionado.id){
        gestor.nombre = respuesta.nombre;
        gestor.direccion  =respuesta.direccion;
        gestor.telefono = respuesta.telefono;
        gestor.identificador = respuesta.identificador;
        gestor.fechaCreacion = respuesta.fechaCreacion;
        gestor.correo = respuesta.correo;
      }
    })
   abrirCerrarModalEditar();
  }).catch(error=>{
    console.log(error);
  })
}



const peticionesDelete= async () => { 
  await axios.delete(`${baseUrl}/${gestorSeleccionado.id}`)
  .then(response=>{
      setData(data.filter(gestor=>gestor.id!==response.data));    
      abrirCerrarModalEliminar();
  }).catch(error=>{
    console.log(error);
  })
}

const seleccionarGestor=(gestor, caso)=>{
setGestorSeleccionado(gestor);
(caso==="Editar")?
abrirCerrarModalEditar(): abrirCerrarModalEliminar();
}


useEffect(()=>{
  peticionesGet();
},[])

  return (
    <div className="App">
     <br></br>
     <button onClick={()=>abrirCerrarModalInsertar()} className='btn btn-success'>Insertar nuevo Cliente</button>
     <table className='table table-bordered'>
      <thead>
        <tr>
        <th>ID</th>
        <th>NOMBRE</th>
        <th>DIRECCION</th>
        <th>TELEFONO</th>
        <th>IDENTIFICADOR</th>
        <th>FECHA CREACION</th>
        <th>CORREO</th>
        <th>ACCIONES</th>

      </tr>
      </thead>

      <tbody>

      {data.map(gestor=>(
        <tr key={gestor.id}>
        <td>{gestor.id}</td>
        <td>{gestor.nombre}</td>
        <td>{gestor.direccion}</td>
        <td>{gestor.telefono}</td>
        <td>{gestor.identificador}</td>
        <td>{gestor.fechaCreacion}</td>
        <td>{gestor.correo}</td>
        <td>
        <button className='btn btn-primary' onClick={()=>seleccionarGestor(gestor,"Editar")}>Editar</button>
        <button className='btn btn-danger' onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
        </td>
        </tr>
      ))}


      </tbody>
     </table>

      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar nuevo Cliente </ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>Id:</label>
        <br />
        <input type="number" className='form-control' name='id' onChange={handleChange}/>
        <br />
        <label>Nombre:</label>
        <br />
        <input type="text" className='form-control' name='nombre' onChange={handleChange}/>
        <br />
        <label>Direccion:</label>
        <br />
        <input type="text" className='form-control' name='direccion' onChange={handleChange}/>
        <br />
        <label>Telefono:</label>
        <br />
        <input type="text" className='form-control' name='telefono' onChange={handleChange}/>
        <br />
        <label>Identificador:</label>
        <br />
        <input type="text" className='form-control' name='identificador' onChange={handleChange}/>
        <br />
        <label>Fecha Creacion:</label>
        <br />
        <input type="date" className='form-control' name='fechaCreacion' onChange={handleChange}/>
        <br />
        <label>Correo:</label>
        <br />
        <input type="text" className='form-control' name='correo' onChange={handleChange}/>
        <br />

        </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionesPost()}>Insertar</button>
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
       </Modal>



       <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Cliente </ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>Id:</label>
        <br />
        <input type="text" className='form-control' readOnly value={gestorSeleccionado && gestorSeleccionado.id}/>
        <br />
        <label>Nombre:</label>
        <br />
        <input type="text" className='form-control' name='nombre' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre}/>
        <br />
        <label>Direccion:</label>
        <br />
        <input type="text" className='form-control' name='direccion' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.direccion}/>
        <br />
        <label>Telefono:</label>
        <br />
        <input type="text" className='form-control' name='telefono' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.telefono}/>
        <br />
        <label>Identificador:</label>
        <br />
        <input type="text" className='form-control' name='identificador' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.identificador}/>
        <br />
        <label>Fecha Creacion:</label>
        <br />
        <input type="date" className='form-control' name='fechaCreacion' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.fechaCreacion} />
        <br />
        <label>Correo:</label>
        <br />
        <input type="text" className='form-control' name='correo' onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.correo}/>
        <br />

        </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionesPut()}>Editar</button>
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
       </Modal>


       <Modal isOpen={modalEliminar} >
      <ModalBody>
      ¿Estas seguro que deseas eliminar el cliente {gestorSeleccionado && gestorSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>peticionesDelete()}>Si</button>
          <button className='btn btn-secondary' onClick={()=>abrirCerrarModalEliminar()} >No</button>
        </ModalFooter>
       </Modal>

    </div>
  );
}

export default App;
