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
      <p>{pregunta.enunciado}</p>
      <div className="opciones">
        <button
          className={` btn ${
            respuesta === true ? "btn-success" : "btn-outline-primary"
          }`}
          disabled={respondido}
          onClick={() => handleSeleccion(true)}
        >
          Si
        </button>
        <button
          className={` btn ${
            respuesta === false ? "btn-danger" : "btn-outline-primary"
          }`}
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
