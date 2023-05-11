import React from "react";
import "../assets/css/DoughnutChart.css";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js/auto";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const DoughnutChart = ({ percentage, title }) => {
  // Define los datos para el gráfico
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [
          title === "Estrategia" ? "#6dba5f" : title === "Tecnología" ? "#f59827" : title === "Gobernanza y liderazgo" ? "#2e27f5" : title === "Procesos" ? "#27d9f5" : title === "Cliente" ? "#f5d927" : title === "Culltura" ? "#7927f5" : "#2c7830",
          "#FFFFFF",
        ],
        borderColor: [title === "Estrategia" ? "#6dba5f" : title === "Tecnología" ? "#f59827" : title === "Gobernanza y liderazgo" ? "#2e27f5" : title === "Procesos" ? "#27d9f5" : title === "Cliente" ? "#f5d927" : title === "Culltura" ? "#7927f5" : "#2c7830"],
        borderWidth: 1,
      },
    ],
  };

  // Define las opciones para el gráfico
  const options = {
    cutoutPercentage: 80, // Define el tamaño del agujero central
    plugins: {
      legend: {
        display: false, // Oculta la leyenda
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div style={{ maxWidth: "" }} className="text-center">
      <h6 className="porcentaje">{percentage.toFixed(0)}%</h6>
      <Doughnut data={data} options={options} style={{ maxWidth:"150px", width:"150px"}}/>
      <h6 style={{color: title === "Estrategia" ? "#6dba5f" : title === "Tecnología" ? "#f59827" : title === "Gobernanza y liderazgo" ? "#2e27f5" : title === "Procesos" ? "#27d9f5" : title === "Cliente" ? "#f5d927" : title === "Culltura" ? "#7927f5" : "#2c7830", maxWidth:"150px", width:"150px"}}>{title}</h6>
    </div>
  );
};

export default DoughnutChart;
