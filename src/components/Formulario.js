import { useState, useEffect, useRef } from "react";
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
import Accordion from "react-bootstrap/Accordion";
import { Radar } from "react-chartjs-2";
import clienteLogo from "../assets/logos/cliente.svg";
import culturaLogo from "../assets/logos/cultura.svg";
import estrategiaLogo from "../assets/logos/estrategia.svg";
import genteLogo from "../assets/logos/gente.svg";
import gobernanzaLogo from "../assets/logos/gobernanza.svg";
import procesosLogo from "../assets/logos/procesos.svg";
import tecnologiaLogo from "../assets/logos/tecnologia.svg";

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
  const [total, setTotal] = useState(0);
  const [nivel, setNivel] = useState("");
  const [resultShow, setResultShow] = useState(false);

  const preguntasPorDimension = preguntas.reduce((obj, pregunta) => {
    obj[pregunta.dimension] = obj[pregunta.dimension] || [];
    obj[pregunta.dimension].push(pregunta);
    return obj;
  }, {});

  const preguntasPorDimensionYNivel = preguntas.reduce((obj, pregunta) => {
    obj[pregunta.dimension] = obj[pregunta.dimension] || {};
    obj[pregunta.dimension][pregunta.nivel] = obj[pregunta.dimension][
      pregunta.nivel
    ] || {
      total: 0,
      respondidas: 0,
    };
    obj[pregunta.dimension][pregunta.nivel].total++;
    if (respuestas[pregunta.id]) {
      obj[pregunta.dimension][pregunta.nivel].respondidas++;
    }
    return obj;
  }, {});

  const preguntasFiltradas = preguntas.filter((pregunta) => {
    if (!pregunta.antecesor) return true;
    const antecesores = Array.isArray(pregunta.antecesor)
      ? pregunta.antecesor
      : [pregunta.antecesor];
    return antecesores.some((id) => {
      const antecesor = preguntas.find((p) => p.id === id);
      const respuestaAntecesor = respuestas[antecesor.id];
      return respuestaAntecesor === true;
    });
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
        label: "Porcentaje",
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
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
    scales: {
      r: {
        grid: {
          color: "black",
        },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          color: "black",
        },
        ticks: {
          color: "black",
          backdropColor: "transparent",
        },
      },
    },
  };

  useEffect(() => {
    const todasRespondidas = preguntasFiltradas.every(
      (pregunta) => respuestas[pregunta.id] !== undefined
    );
    setFormularioComplete(todasRespondidas);
  }, [respuestas]);

  useEffect(() => {
    const porcentajeTotal =
      (estrategia +
        tecnologia +
        gobernanza +
        procesos +
        cliente +
        cultura +
        gente) /
      7;
    setTotal(porcentajeTotal);
    if (porcentajeTotal < 15) setNivel("Incipiente");
    else if (porcentajeTotal >= 15 && porcentajeTotal < 25) setNivel("Inicial");
    else if (porcentajeTotal >= 25 && porcentajeTotal < 45)
      setNivel("En desarrollo");
    else if (porcentajeTotal >= 45 && porcentajeTotal < 60)
      setNivel("Establecido");
    else if (porcentajeTotal >= 60 && porcentajeTotal < 85)
      setNivel("Avanzado");
    else if (porcentajeTotal >= 85) setNivel("Digital");
  }, [estrategia, tecnologia, gobernanza, procesos, cliente, cultura, gente]);

  const hiddenElements = useRef([]);

  useEffect(() => {
    if (!resultShow) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("show-news");
            }, 200 * (index + 1));
          }
        });
      });
      hiddenElements.current.forEach((element) => {
        observer.observe(element);
      });
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (resultShow) {
      setTimeout(() => {
        // Asignar una clase diferente después de 2 segundos
        document.getElementById("porcentaje").classList.add("show-news");
      }, 200);
      setTimeout(() => {
        // Asignar una clase diferente después de 2 segundos
        document.getElementById("nivel-actual").classList.add("show-news");
      }, 600);
      setTimeout(() => {
        // Asignar una clase diferente después de 2 segundos
        document.getElementById("nivel").classList.add("show-news");
      }, 1000);
    }
  }, [resultShow]);

  return (
    <div className="container pt-4 col-xxl-8 mb-4">
      <h1 className="text-center">Evaluación de Capacidad Digital</h1>
      {!resultShow ? (
        <div className="d-flex flex-column align-items-center">
          {Object.entries(preguntasPorDimension).map(
            ([dimension, preguntas], index) => (
              <Accordion
                defaultActiveKey={"Estrategia"}
                className="w-100 show hidden-news"
                key={index}
                ref={(element) => (hiddenElements.current[index] = element)}
              >
                <Accordion.Item
                  key={dimension}
                  eventKey={dimension}
                  className="mb-4 w-100"
                >
                  <Accordion.Header className="">
                    <img
                      src={
                        dimension === "Estrategia"
                          ? estrategiaLogo
                          : dimension === "Gobernanza y liderazgo"
                          ? gobernanzaLogo
                          : dimension === "Tecnología"
                          ? tecnologiaLogo
                          : dimension === "Procesos"
                          ? procesosLogo
                          : dimension === "Cliente"
                          ? clienteLogo
                          : dimension === "Cultura"
                          ? culturaLogo
                          : genteLogo
                      }
                      alt={`img ${dimension}`}
                      style={{ maxWidth: "35px" }}
                      className="me-3"
                    />
                    {dimension}
                  </Accordion.Header>
                  <Accordion.Body className="">
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
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )
          )}
          <button
            className="btn btn-primary w-25 mb-4"
            disabled={!formularioComplete}
            onClick={() => {
              // Recorrer cada dimensión
              Object.keys(preguntasPorDimensionYNivel).forEach((dimension) => {
                const niveles = preguntasPorDimensionYNivel[dimension];
                var porcentajeDimension = 0;
                // Recorrer cada nivel dentro de la dimensión
                Object.keys(niveles).forEach((nivel) => {
                  const totalPreguntas = niveles[nivel].total;
                  const totalRespondidas = niveles[nivel].respondidas;
                  const porcentajeNivel =
                    0.2 * (totalRespondidas / totalPreguntas);
                  porcentajeDimension += porcentajeNivel;
                });
                porcentajeDimension = porcentajeDimension * 100;
                if (dimension === "Estrategia")
                  setEstrategia(porcentajeDimension);

                if (dimension === "Tecnología")
                  setTecnologia(porcentajeDimension);

                if (dimension === "Gobernanza y liderazgo")
                  setGobernanza(porcentajeDimension);

                if (dimension === "Procesos") setProcesos(porcentajeDimension);

                if (dimension === "Cliente") setCliente(porcentajeDimension);

                if (dimension === "Cultura") setCultura(porcentajeDimension);

                if (dimension === "Gente y Habilidades")
                  setGente(porcentajeDimension);
              });
              setResultShow(true);
            }}
          >
            Enviar respuestas
          </button>
        </div>
      ) : (
        <div>
          <div className="card mb-4">
            <div className="card-header">Resultados</div>
            <div
              className="card-body align-self-center d-flex align-items-center"
              style={{ height: "80vh" }}
            >
              <Radar options={options} data={data} style={{ height: "100%" }} />
              <div className="d-flex flex-column align-items-center">
                <p id="nivel-actual" className="hidden-news">Tu nivel actual es:</p>
                <h1 id="nivel" className="hidden-news">{nivel}</h1>
                <p id="porcentaje" className="hidden-news">Promedio del porcentaje fue: {total.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formulario;
