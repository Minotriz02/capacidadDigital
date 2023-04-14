import { useState, useRef, useEffect } from "react";
import "../assets/css/Pregunta.css";
import { Button } from "react-bootstrap";

function Pregunta({ pregunta, respuesta, handleRespuesta }) {
  const [selected, setSelected] = useState(null);

  const handleSeleccion = (respuesta) => {
    setSelected(respuesta);
    handleRespuesta(pregunta.id, respuesta);
  };

  const resetRespuesta = () => {
    setSelected(null);
    handleRespuesta(pregunta.id, null);
  };

  const hiddenElement = useRef(null);

 useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('show-pregunta');
                    }, 100);
                }
            });
        });

        observer.observe(hiddenElement.current);
        return () => {
            observer.disconnect();
        };
    }, []);
  return (
    <div className={`pregunta hidden-pregunta ${pregunta.dimension}`} ref={hiddenElement}>
      <p>{pregunta.enunciado}</p>
      <div className="opciones">
        <Button
          className={`btn ${
            selected === true
              ? "btn-success"
              : respuesta === true
              ? "btn-outline-success text-white"
              : "btn-outline-primary text-white"
          }`}
          onClick={() => {
            if (selected === true) {
              resetRespuesta();
            } else {
              handleSeleccion(true);
            }
          }}
        >
          Si
        </Button>
        <Button
          className={`btn ${
            selected === false
              ? "btn-danger"
              : respuesta === false
              ? "btn-outline-danger text-white"
              : "btn-outline-primary text-white"
          }`}
          onClick={() => {
            if (selected === false) {
              resetRespuesta();
            } else {
              handleSeleccion(false);
            }
          }}
        >
          No
        </Button>
      </div>
    </div>
  );
}

export default Pregunta;
