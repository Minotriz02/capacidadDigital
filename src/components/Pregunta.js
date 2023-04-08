import { useState } from "react";
import "../assets/css/Pregunta.css";

function Pregunta({ pregunta, respuesta, handleRespuesta }) {
  const [respondido, setRespondido] = useState(false);

  const handleSeleccion = (respuesta) => {
    setRespondido(true);
    handleRespuesta(pregunta.id, respuesta);
  };

  return (
    <div className={`pregunta ${pregunta.dimension}`}>
      <h5>{pregunta.enunciado}</h5>
      <div className="opciones">
        <button
          className={`opcion ${respuesta === true ? "seleccionado" : ""}`}
          disabled={respondido}
          onClick={() => handleSeleccion(true)}
        >
          Si
        </button>
        <button
          className={`opcion ${respuesta === false ? "no seleccionado" : ""}`}
          disabled={respondido}
          onClick={() => handleSeleccion(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default Pregunta;
