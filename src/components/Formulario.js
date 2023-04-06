import { useState } from "react";
import preguntas from "../assets/json/preguntas.json";
import Pregunta from "./Pregunta";

function Formulario() {
  const [respuestas, setRespuestas] = useState({});

  const handleRespuesta = (id, respuesta) => {
    setRespuestas({
      ...respuestas,
      [id]: respuesta,
    });
  };

  const preguntasPorDimension = preguntas.reduce((obj, pregunta) => {
    obj[pregunta.dimension] = obj[pregunta.dimension] || [];
    obj[pregunta.dimension].push(pregunta);
    return obj;
  }, {});

  const preguntasSinAntecesor = preguntas.filter(
    (pregunta) => !pregunta.antecesor
  );

  const preguntasFiltradas = preguntasSinAntecesor.filter((pregunta) => {
    if (!pregunta.antecesor) return true;
    const antecesor = preguntas.find((p) => p.id === pregunta.antecesor);
    return antecesor.respuesta;
  });

  return (
    <div>
      {Object.entries(preguntasPorDimension).map(([dimension, preguntas]) => (
        <div key={dimension}>
          <h2>{dimension}</h2>
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
      ))}
    </div>
  );
}

export default Formulario;
