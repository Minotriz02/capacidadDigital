import { useState, useEffect } from "react";
import preguntas from "../assets/json/preguntas.json";
import Pregunta from "./Pregunta";
import "../assets/css/Formulario.css";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function Formulario() {
  const [respuestas, setRespuestas] = useState({});
  const [formularioComplete, setFormularioComplete] = useState(false);
  const [estrategia, setEstrategia] = useState(0);
  const [gobernanza, setGobernanza] = useState(0);
  const [tecnologia, setTecnologia] = useState(0);
  const [procesos, setProcesos] = useState(0);
  const [cliente, setCliente] = useState(0);
  const [cultura, setCultura] = useState(0);
  const [gente, setGente] = useState(0);
  const [resultShow, setResultShow] = useState(false);

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

  const data = {
    labels: [
      "Estrategia",
      "Tecnología",
      "Gobernanza y liderazgo",
      "Procesos",
      "Cliente",
      "Cultura",
      "Gente y Habilidades",
    ],
    datasets: [
      {
        label: "Puntaje",
        data: [
          estrategia,
          tecnologia,
          gobernanza,
          procesos,
          cliente,
          cultura,
          gente,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    legend: {
      labels: {
        fontColor: "white", // color del texto de las leyendas
      },
      display: true,
      position: "bottom",
      align: "center",
      reverse: false,
      backgroundColor: "black", // color de fondo de las leyendas
      onClick: (e) => {},
    },
  };

  useEffect(() => {
    const todasRespondidas = preguntasFiltradas.every(
      (pregunta) => respuestas[pregunta.id] !== undefined
    );
    setFormularioComplete(todasRespondidas);
  }, [respuestas]);

  // useEffect(() => {
  //   console.log("Tecnologia: ", tecnologia);
  //   console.log("Estrategia: ", estrategia);
  //   console.log("Gobernanza y liderazgo: ", gobernanza);
  // }, [tecnologia, estrategia, gobernanza]);

  return (
    <div className="container pt-4 col-xxl-8 text-light">
      <h1 className="text-center">Evaluación de capacidad digital</h1>
      {!resultShow ? (
        <div>
          {Object.entries(preguntasPorDimension).map(
            ([dimension, preguntas]) => (
              <div key={dimension} className="card mb-4 bg-dark">
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
            )
          )}
          <button
            className="btn btn-primary"
            disabled={!formularioComplete}
            onClick={() => {
              var estrategiaCount = 0;
              var gobernanzaCount = 0;
              var tecnologiaCount = 0;
              var procesosCount = 0;
              var clienteCount = 0;
              var culturaCount = 0;
              var genteCount = 0;
              preguntasFiltradas.map((pregunta) => {
                pregunta.respuesta = respuestas[pregunta.id];
                if (
                  pregunta.dimension === "Estrategia" &&
                  respuestas[pregunta.id] === true
                ) {
                  estrategiaCount++;
                }

                if (
                  pregunta.dimension === "Tecnología" &&
                  respuestas[pregunta.id] === true
                ) {
                  tecnologiaCount++;
                }

                if (
                  pregunta.dimension === "Gobernanza y liderazgo" &&
                  respuestas[pregunta.id] === true
                ) {
                  gobernanzaCount++;
                }
                if (
                  pregunta.dimension === "Procesos" &&
                  respuestas[pregunta.id] === true
                ) {
                  procesosCount++;
                }
                if (
                  pregunta.dimension === "Cliente" &&
                  respuestas[pregunta.id] === true
                ) {
                  clienteCount++;
                }
                if (
                  pregunta.dimension === "Cultura" &&
                  respuestas[pregunta.id] === true
                ) {
                  culturaCount++;
                }
                if (
                  pregunta.dimension === "Gente y Habilidades" &&
                  respuestas[pregunta.id] === true
                ) {
                  genteCount++;
                }
              });
              setEstrategia(estrategiaCount);
              setTecnologia(tecnologiaCount);
              setGobernanza(gobernanzaCount);
              setProcesos(procesosCount);
              setCliente(clienteCount);
              setCultura(culturaCount);
              setGente(genteCount);
              setResultShow(true);
            }}
          >
            Enviar respuestas
          </button>
        </div>
      ) : (
        <div>
          <div className="card mb-4 bg-dark">
            <div className="card-header">Resultados</div>
            <div
              className="card-body align-self-center"
              style={{ height: "80vh" }}
            >
              <Radar data={data} style={{ height: "100%" }} options={options} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formulario;
