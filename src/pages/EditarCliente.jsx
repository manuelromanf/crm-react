import { Form, redirect, useActionData, useLoaderData, useNavigate } from "react-router-dom";
import { actualizarCliente, obtenerCliente } from "../data/clientes";
import { Formulario } from "../components/Formulario";
import { Error } from "../components/Error";


export async function loader ({params}) {
    const cliente = await obtenerCliente(params.clienteId);
    if(Object.values(cliente).length === 0){
      throw new Response('', {
        status: 404, 
        statusText: 'El cliente no fue encontrado'
      })
    }
    return cliente
}

export async function action ({request, params}) {

  const formData = await request.formData()
  const datos = Object.fromEntries(formData)
  const email = formData.get('email')

  const errores = []
  if(Object.values(datos).includes('')){
    errores.push('Todos los campos son obligatorios')
  }

  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  if(!regex.test(email)){
    errores.push('El email no es valido')
  }

  if(Object.keys(errores).length){
    return errores
  }
  
  await actualizarCliente(params.clienteId, datos)

  return redirect('/')
}

export const EditarCliente = () => {

  const errores = useActionData()
  const navigate = useNavigate();
  const cliente = useLoaderData();

  return (
    <>
      <h1 className='font-black text-4xl text-blue-900'>Editar cliente</h1>
      <p className='mt-3'>a continuacion podras modificat los datos de un cliente</p>

      <div className="flex justify-end">
        <button 
        className="text-blue-800 hover:text-blue-700 uppercase font-bold"
        onClick={() => navigate(-1)}
        >  
          Volver
        </button>
      </div>

      <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20">

        {errores?.length && errores.map( (error, i) => <Error key={i}>{error}</Error> )}

        <Form 
          method='post'
          noValidate
        >

          <Formulario 
            cliente={cliente}
          />

          <input 
          type="submit" 
          className="mt-5 w-full bg-blue-800 uppercase p-3 font-bold text-white text-lg rounded-md"
          value="Guardar cambios"
          />
        </Form>
      </div>

  </>
  )
}
