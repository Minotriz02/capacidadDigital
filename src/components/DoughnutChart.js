import React from 'react';
import "../assets/css/DoughnutChart.css"
import { Doughnut } from 'react-chartjs-2';
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
                    '#36A2EB',
                    '#FFFFFF'
                ],
                borderWidth: 0
            }
        ]
    };

    // Define las opciones para el gráfico
    const options = {
        cutoutPercentage: 80, // Define el tamaño del agujero central
        plugins: {
            legend: {
                display: false // Oculta la leyenda
            }
        },
        responsive: true,
        maintainAspectRatio: true
    };

    return (
        <div style={{maxWidth: "13%"}} className='text-center'>
            <h6 style={{height:"39px"}}>{title}</h6>
            <h6 className='porcentaje'>{percentage.toFixed(0)}%</h6>
            <Doughnut data={data} options={options} />
        </div>

    );
};

export default DoughnutChart;
 