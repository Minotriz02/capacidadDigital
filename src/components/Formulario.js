import { useState, useEffect, useRef } from "react";
import preguntas from "../assets/json/preguntas.json";
import descripcionNivel from "../assets/json/textoNiveles.json";
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
import { Col, ProgressBar } from "react-bootstrap";

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
  const [proximoEstrategia, setProximoEstrategia] = useState(0);
  const [proximoGobernanza, setProximoGobernanza] = useState(0);
  const [proximoTecnologia, setProximoTecnologia] = useState(0);
  const [proximoProcesos, setProximoProcesos] = useState(0);
  const [proximoCliente, setProximoCliente] = useState(0);
  const [proximoCultura, setProximoCultura] = useState(0);
  const [proximoGente, setProximoGente] = useState(0);
  const [proximoTotal, setProximoTotal] = useState(0);
  const [nivel, setNivel] = useState("");
  const [resultShow, setResultShow] = useState(false);
  const [showRuta, setShowRuta] = useState(false);

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
      respondidasFalse: 0,
    };
    obj[pregunta.dimension][pregunta.nivel].total++;
    if (respuestas[pregunta.id]) {
      obj[pregunta.dimension][pregunta.nivel].respondidas++;
    } else if (respuestas[pregunta.id] === false) {
      obj[pregunta.dimension][pregunta.nivel].respondidasFalse++;
    }
    return obj;
  }, {});

  function preguntasPorcentajeRespondidasPorDimension(dimension) {
    const preguntasEnDimension = preguntas.filter(
      (pregunta) => pregunta.dimension === dimension
    );
    let respondidas = 0;
    for (const pregunta of preguntasEnDimension) {
      if (respuestas[pregunta.id] || respuestas[pregunta.id] === false) {
        respondidas++;
      }
    }
    const porcentaje =
      (respondidas /
        preguntasFiltradas.filter(
          (pregunta) => pregunta.dimension === dimension
        ).length) *
      100;
    return porcentaje;
  }

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
        label: "Estado Actual",
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

  const dataRuta = {
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
        label: "Estado Actual",
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
      {
        label: "Estado Objetivo",
        data: [
          proximoEstrategia,
          proximoTecnologia,
          proximoGobernanza,
          proximoProcesos,
          proximoCliente,
          proximoCultura,
          proximoGente,
        ],
        backgroundColor: "rgba(53, 162, 235, 0)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 3,
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
      setTimeout(() => {
        // Asignar una clase diferente después de 2 segundos
        document.getElementById("descripcion").classList.add("show-news");
      }, 200);
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
                  <ProgressBar
                    variant={
                      preguntasPorcentajeRespondidasPorDimension(dimension) ===
                      100
                        ? "success"
                        : preguntasPorcentajeRespondidasPorDimension(
                            dimension
                          ) <= 50
                        ? "danger"
                        : "primary"
                    }
                    now={preguntasPorcentajeRespondidasPorDimension(dimension)}
                  ></ProgressBar>
                  <Accordion.Header className={dimension.split(" ")[0]}>
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
                var porcentajeProximaDimension = 0;
                // Recorrer cada nivel dentro de la dimensión
                Object.keys(niveles).forEach((nivel) => {
                  const totalPreguntas = niveles[nivel].total;
                  const totalRespondidas = niveles[nivel].respondidas;
                  const totalRespondidasConFalse =
                    niveles[nivel].respondidas +
                    niveles[nivel].respondidasFalse;
                  const porcentajeNivel =
                    0.2 * (totalRespondidas / totalPreguntas);
                  const porcentajeProximoNivel =
                    0.2 * (totalRespondidasConFalse / totalPreguntas);
                  porcentajeDimension += porcentajeNivel;
                  porcentajeProximaDimension += porcentajeProximoNivel;
                });
                porcentajeDimension = porcentajeDimension * 100;
                porcentajeProximaDimension = porcentajeProximaDimension * 100;
                if (dimension === "Estrategia") {
                  setEstrategia(porcentajeDimension);
                  setProximoEstrategia(porcentajeProximaDimension);
                }

                if (dimension === "Tecnología") {
                  setTecnologia(porcentajeDimension);
                  setProximoTecnologia(porcentajeProximaDimension);
                }

                if (dimension === "Gobernanza y liderazgo") {
                  setGobernanza(porcentajeDimension);
                  setProximoGobernanza(porcentajeProximaDimension);
                }
                if (dimension === "Procesos") {
                  setProcesos(porcentajeDimension);
                  setProximoProcesos(porcentajeProximaDimension);
                }

                if (dimension === "Cliente") {
                  setCliente(porcentajeDimension);
                  setProximoCliente(porcentajeProximaDimension);
                }

                if (dimension === "Cultura") {
                  setCultura(porcentajeDimension);
                  setProximoCultura(porcentajeProximaDimension);
                }

                if (dimension === "Gente y Habilidades") {
                  setGente(porcentajeDimension);
                  setProximoGente(porcentajeProximaDimension);
                }
              });
              setResultShow(true);
              console.log(
                "preguntasPorDimensionYNivel",
                preguntasPorDimensionYNivel
              );
            }}
          >
            Ver Nivel de Madurez Actual
          </button>
        </div>
      ) : (
        <div>
          <div className="card mb-4">
            <div className="card-header">Resultados</div>
            <div
              className="card-body align-self-center d-flex align-items-center flex-column flex-xl-row"
         
            >
              <Col>
                <Radar
                  options={options}
                  data={showRuta ? dataRuta : data}
                  className=""
                />
              </Col>
              <Col>
              <div className="d-flex flex-column align-items-center">
                <p id="nivel-actual" className="hidden-news">
                  Tu nivel actual es:
                </p>
                <h1 id="nivel" className="hidden-news">
                  {nivel}
                </h1>
                <p id="porcentaje" className="hidden-news">
                  Promedio del porcentaje fue: {total.toFixed(2)}%
                </p>
                <p id="descripcion" className="hidden-news">
                  {descripcionNivel.find((d) => d.nivel === nivel).descripcion}
                </p>
                {!showRuta && (
                  <button
                    className="btn btn-primary mb-4"
                    onClick={() => {
                      setShowRuta(true);
                    }}
                  >
                    Obtener hoja de ruta
                  </button>
                )}
              </div>
              </Col>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formulario;
