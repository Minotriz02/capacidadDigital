import { useState, useEffect } from "react";
import preguntas from "../assets/json/preguntas.json";
import Pregunta from "./Pregunta";
import "../assets/css/Formulario.css";

function Formulario() {
  const [respuestas, setRespuestas] = useState({});
  const [formularioComplete, setFormularioComplete] = useState(false)

  const preguntasPorDimension = preguntas.reduce((obj, pregunta) => {
    obj[pregunta.dimension] = obj[pregunta.dimension] || [];
    obj[pregunta.dimension].push(pregunta);
    return obj;
  }, {});

  const preguntasFiltradas = preguntas.filter((pregunta) => {
    if (!pregunta.antecesor) return true;
    const antecesor = preguntas.find((p) => p.id === pregunta.antecesor);
    const respuestaAntecesor = respuestas[antecesor.id];
    return respuestaAntecesor === true;
  });

  const handleRespuesta = (id, respuesta) => {
    setRespuestas({
      ...respuestas,
      [id]: respuesta,
    });
  };

  useEffect(() => {
    const todasRespondidas = preguntasFiltradas.every(
      (pregunta) => respuestas[pregunta.id] !== undefined
    );
    setFormularioComplete(todasRespondidas);
  }, [respuestas]);

  return (
    <div className="container pt-4 col-xxl-8">
      <h1 className="text-center">Evaluación de capacidad digital</h1>
      {Object.entries(preguntasPorDimension).map(([dimension, preguntas]) => (
        <div key={dimension} className="card mb-4">
          <div className="card-header">{dimension}</div>
          <div className="card-body">
            <form>
              {preguntasFiltradas
                .filter((pregunta) => pregunta.dimension === dimension)
                .map((pregunta) => (
                  <Pregunta
                    key={pregunta.id}
                    pregunta={pregunta}
                    respuesta={respuestas[pregunta.id]}
                    handleRespuesta={handleRespuesta}
                  />
                ))}
            </form>
          </div>
        </div>
      ))}
      <button
        className="btn btn-primary"
        disabled={!formularioComplete}
      >
        Enviar respuestas
      </button>
    </div>
  );
}

export default Formulario;
