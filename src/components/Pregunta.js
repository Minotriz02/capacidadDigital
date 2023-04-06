import { useState } from "react";

function Pregunta({ pregunta, respuesta, handleRespuesta }) {
  const [respondido, setRespondido] = useState(false);

  const handleSeleccion = (respuesta) => {
    setRespondido(true);
    handleRespuesta(pregunta.id, respuesta);
  };

  return (
    <div className={`pregunta ${pregunta.dimension}`}>
      <h3>{pregunta.enunciado}</h3>
      <div className="opciones">
        <button
          className={`opcion ${respuesta === true ? "seleccionado" : ""}`}
          disabled={respondido}
          onClick={() => handleSeleccion(true)}
        >
          Sí
        </button>
        <button
          className={`opcion ${respuesta === false ? "seleccionado" : ""}`}
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
