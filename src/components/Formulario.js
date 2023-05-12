import { useState, useEffect, useRef } from "react";
import preguntas from "../assets/json/preguntas.json";
import descripcionNivel from "../assets/json/textoNiveles.json";
import afirmaciones from "../assets/json/afirmaciones.json";
import fortalezaDebilidades from "../assets/json/fortalezasDebilidades.json";
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
import {
  Col,
  ListGroup,
  ProgressBar,
  Row,
  Table,
  Modal,
  Button,
} from "react-bootstrap";
import html2pdf from "html2pdf.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import DoughnutChart from "./DoughnutChart";
import GaugeChart from "react-gauge-chart";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  const [nivel, setNivel] = useState("");
  const [resultShow, setResultShow] = useState(false);
  const [showRuta, setShowRuta] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [orgName, setOrgName] = useState("");

  const handleClose = () => {
    const input = document.getElementById("org-name-input");
    setOrgName(input.value);
    setShowModal(false);
  };
  let preguntasNegativas = [];

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
      preguntasNegativas.push({
        idPregunta: pregunta.id,
        dimension: pregunta.dimension,
      });
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
        backgroundColor: "rgba(50, 168, 82, 0.2)",
        borderColor: "rgba(50, 168, 82, 1)",
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
        backgroundColor: "rgba(50, 168, 82, 0.2)",
        borderColor: "rgba(50, 168, 82, 1)",
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
          stepSize: 20,
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
    if (porcentajeTotal <= 10) setNivel("Incipiente");
    else if (porcentajeTotal > 10 && porcentajeTotal <= 20) setNivel("Inicial");
    else if (porcentajeTotal > 20 && porcentajeTotal <= 40)
      setNivel("En desarrollo");
    else if (porcentajeTotal > 40 && porcentajeTotal <= 60)
      setNivel("Establecido");
    else if (porcentajeTotal > 60 && porcentajeTotal <= 80)
      setNivel("Avanzado");
    else if (porcentajeTotal > 81) setNivel("Digital");
  }, [estrategia, tecnologia, gobernanza, procesos, cliente, cultura, gente]);

  const hiddenElements = useRef([]);
  const tableRef = useRef(null);

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
      // setTimeout(() => {
      //   // Asignar una clase diferente después de 2 segundos
      //   document.getElementById("porcentaje").classList.add("show-news");
      // }, 200);
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

  useEffect(() => {
    if (showRuta && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showRuta]);

  const handleDownloadPDF = () => {
    //Preguntas
    const preguntasSeleccionadas = Object.entries(respuestas)
      .filter(([id, respuesta]) => preguntas.some((p) => p.id === parseInt(id)))
      .map(([id]) => {
        const pregunta = preguntas.find((p) => p.id === parseInt(id));
        return {
          id: pregunta.id,
          enunciado: pregunta.enunciado,
          respuesta: respuestas[id],
        };
      });

    // Crea un array con las filas de la tabla
    const rows = preguntasSeleccionadas.map((p) => [
      p.enunciado,
      p.respuesta ? "si" : "no",
    ]);
    console.log(rows);

    // Define la estructura del documento PDF
    const docDefinition = {
      content: [
        { text: "Respuestas", style: "header" },
        { table: { body: [["Pregunta", "Respuesta"], ...rows] } },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    // Genera el documento PDF y lo descarga
    pdfMake.createPdf(docDefinition).download("respuestas.pdf");

    //Resultado
    const father = document.getElementById("father");
    const input = document.getElementById("my-pdf-content");

    const options = {
      margin: [0, -500, 0, 0],
      filename: "resultados.pdf",
      html2canvas: {
        scale: 1.5,
        userCORS: true,
        allowTaint: true,
      },
      jsPDF: {
        unit: "px",
        format: [input.offsetHeight + 800, input.offsetWidth + 1000],
        orientation: "p",
      },
    };
    html2pdf().from(father).set(options).save();
  };

  const getFortalezaAndDebilidades = () => {
    const nuevoArreglo = [];

    fortalezaDebilidades.forEach((objeto) => {
      let porcentajeTotal = 0;
      objeto.dimension === "Estrategia"
        ? (porcentajeTotal = estrategia)
        : objeto.dimension === "Gobernanza y liderazgo"
        ? (porcentajeTotal = gobernanza)
        : objeto.dimension === "Procesos"
        ? (porcentajeTotal = procesos)
        : objeto.dimension === "Gente y Habilidades"
        ? (porcentajeTotal = gente)
        : (porcentajeTotal = 0);
      let nivel = "";

      if (porcentajeTotal <= 10) nivel = "Incipiente";
      else if (porcentajeTotal > 10 && porcentajeTotal <= 20) nivel = "Inicial";
      else if (porcentajeTotal > 20 && porcentajeTotal <= 40)
        nivel = "En desarrollo";
      else if (porcentajeTotal > 40 && porcentajeTotal <= 60)
        nivel = "Establecido";
      else if (porcentajeTotal > 60 && porcentajeTotal <= 80)
        nivel = "Avanzado";
      else if (porcentajeTotal > 81) nivel = "Digital";

      const fortaleza = 2; /* Obtener la fortaleza correspondiente al nivel y dimensión */
      const debilidad = 2; /* Obtener la debilidad correspondiente al nivel y dimensión */

      const objetoModificado = {
        dimension: objeto.dimension,
        nivel: nivel,
        fortaleza: fortaleza,
        debilidad: debilidad,
      };

      nuevoArreglo.push(objetoModificado);
    });
    console.log(nuevoArreglo);
  };

  return (
    <div className="container pt-4 col-xxl-8 mb-4" id="father">
      <div id="my-pdf-content">
        <h1 className="text-center">Evaluación de Capacidad Digital</h1>
        <Modal show={showModal} onHide={handleClose} backdrop="static">
          <Modal.Header>
            <Modal.Title>Ayudanos con el nombre de tu organización</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Ingresa el nombre de tu organización</p>
            <input
              type="text"
              placeholder="Completa este campo"
              id="org-name-input"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
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
                        preguntasPorcentajeRespondidasPorDimension(
                          dimension
                        ) === 100
                          ? "success"
                          : preguntasPorcentajeRespondidasPorDimension(
                              dimension
                            ) <= 50
                          ? "danger"
                          : "primary"
                      }
                      now={preguntasPorcentajeRespondidasPorDimension(
                        dimension
                      )}
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
                          .filter(
                            (pregunta) => pregunta.dimension === dimension
                          )
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
                Object.keys(preguntasPorDimensionYNivel).forEach(
                  (dimension) => {
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
                    porcentajeProximaDimension =
                      porcentajeProximaDimension * 100;
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
                  }
                );
                setResultShow(true);
                console.log(respuestas);
                console.log(preguntasNegativas);
              }}
            >
              Ver Diagnóstico
            </button>
          </div>
        ) : (
          <div>
            <div className="card mb-4">
              <div className="card-header">
                Resultados de la organización {orgName}
              </div>
              <div className="card-body">
                <Row className="align-items-center">
                  <Col className="col-12">
                    <h2>{orgName}</h2>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col className="col-12 col-md-6">
                    <Radar
                      options={options}
                      data={showRuta ? dataRuta : data}
                      className=""
                    />
                  </Col>
                  <Col className="col-12 col-md-6">
                    <GaugeChart
                      id="gauge-chart2"
                      nrOfLevels={6}
                      percent={total.toFixed(2) / 100}
                      colors={["#1c67e8", "#bff593"]}
                      textColor="#000000"
                      cornerRadius={0}
                      arcPadding={0}
                      needleColor="#6ae65a"
                      needleBaseColor="#6ae65a"
                    />
                    <div className="d-flex flex-column align-items-center">
                      <p id="nivel-actual" className="hidden-news">
                        Tu nivel actual es:
                      </p>
                      <h1 id="nivel" className="hidden-news">
                        {nivel}
                      </h1>
                      {/* <p id="porcentaje" className="hidden-news">
                      Promedio del porcentaje fue: {total.toFixed(2)}%
                    </p> */}
                    </div>
                  </Col>
                </Row>
                <div className="d-flex flex-wrap gap-3 justify-content-around">
                  <div className="">
                    <DoughnutChart percentage={estrategia} title="Estrategia" />
                  </div>
                  <div className="">
                    <DoughnutChart percentage={tecnologia} title="Tecnología" />
                  </div>
                  <div className="">
                    <DoughnutChart
                      percentage={gobernanza}
                      title="Gobernanza y liderazgo"
                    />
                  </div>
                  <div className="">
                    <DoughnutChart percentage={procesos} title="Procesos" />
                  </div>
                  <div className="">
                    <DoughnutChart percentage={cliente} title="Cliente" />
                  </div>
                  <div className="">
                    <DoughnutChart percentage={cultura} title="Culltura" />
                  </div>
                  <div className="">
                    <DoughnutChart
                      percentage={gente}
                      title="Gente y habilidades"
                    />
                  </div>
                </div>
                <Row className="my-3">
                  <Col>
                    <p
                      id="descripcion"
                      className="hidden-news"
                      style={{ textAlign: "justify" }}
                    >
                      {
                        descripcionNivel.find((d) => d.nivel === nivel)
                          .descripcion
                      }
                    </p>
                  </Col>
                </Row>
                {!showRuta && (
                  <Row className="justify-content-center">
                    <button
                      className="btn btn-primary mb-4 col-auto"
                      onClick={() => {
                        setShowRuta(true);
                        getFortalezaAndDebilidades();
                      }}
                    >
                      Obtener hoja de ruta
                    </button>
                  </Row>
                )}
                {showRuta && (
                  <Row>
                    <Col className="col-12">
                      <h2>Fortalezas y debilidades de la organización</h2>
                    </Col>
                    <Col className="col-12">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Fortalezas</th>
                            <th>Debilidades</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>FDF</td>
                            <td>FS</td>
                          </tr>
                          <tr>
                            <td>F</td>
                            <td>FFFDS</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                )}
                {showRuta && (
                  <Row>
                    <Col>
                      <p>
                        La siguiente tabla muestra la hoja de ruta a seguir en
                        trasformación digital, si la empresa quiere avanzar en
                        su proceso de madurez.
                      </p>
                      <Table striped bordered hover responsive ref={tableRef}>
                        <thead className="bg-primary text-light">
                          <tr>
                            <th>Capacidad</th>
                            <th>Estado Actual</th>
                            <th>Estado Objetivo</th>
                            <th>Recomendaciones de Mejora</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Estrategia</td>
                            <td>{estrategia.toFixed(0)}%</td>
                            <td>{proximoEstrategia.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension === "Estrategia"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                          <tr>
                            <td>Tecnología</td>
                            <td>{tecnologia.toFixed(0)}%</td>
                            <td>{proximoTecnologia.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension === "Tecnología"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                          <tr>
                            <td>Gobernanza y Liderazgo</td>
                            <td>{gobernanza.toFixed(0)}%</td>
                            <td>{proximoGobernanza.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension ===
                                      "Gobernanza y liderazgo"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                          <tr>
                            <td>Procesos</td>
                            <td>{procesos.toFixed(0)}%</td>
                            <td>{proximoProcesos.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension === "Procesos"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                          <tr>
                            <td>Cliente</td>
                            <td>{cliente.toFixed(0)}%</td>
                            <td>{proximoCliente.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension === "Cliente"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                          <tr>
                            <td>Gente y Habilidades</td>
                            <td>{gente.toFixed(0)}%</td>
                            <td>{proximoGente.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension ===
                                      "Gente y Habilidades"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                          <tr>
                            <td>Cultura</td>
                            <td>{cultura.toFixed(0)}%</td>
                            <td>{proximoCultura.toFixed(0)}%</td>
                            <td>
                              <ListGroup
                                as="ol"
                                numbered
                                variant="flush"
                                className="bg-transparent"
                              >
                                {preguntasNegativas
                                  .filter(
                                    (pregunta) =>
                                      pregunta.dimension === "Cultura"
                                  )
                                  .map((pregunta, i) => {
                                    const recomendacion = afirmaciones.find(
                                      (r) =>
                                        r.idPregunta === pregunta.idPregunta
                                    );
                                    return (
                                      <ListGroup.Item
                                        key={i}
                                        as="li"
                                        className="bg-transparent"
                                      >
                                        {recomendacion.afirmacion}
                                      </ListGroup.Item>
                                    );
                                  })}
                              </ListGroup>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                )}
                {showRuta && (
                  <button
                    className="btn btn-primary"
                    onClick={handleDownloadPDF}
                  >
                    <span className="me-2">
                      <FontAwesomeIcon icon={faDownload} />
                    </span>
                    Descargar PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Formulario;
