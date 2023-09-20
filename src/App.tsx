import { IUsuario, UsuarioService } from './app/services/api/usuario/UsuarioService';
import { useState, useEffect } from 'react';
import './App.css';
import { ApiException } from './app/services/api/ApiException';
import React from 'react';

const App = () => {
  const [list, setList] = useState<IUsuario[]>([]);

  useEffect(() => {
    UsuarioService.get().then((result) => {
      if (result instanceof ApiException) {
        alert(result.message);
      } else {
        setList(result);
      }
    }
    )
  })

  return (
    <div>

    </div>
  );

}
export default App;