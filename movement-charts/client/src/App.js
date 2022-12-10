import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { Col, Container, Form, Row } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const fields = ['EBL', 'EBR', 'EBT', 'NBL', 'NBR', 'NBT', 'SBL', 'SBR', 'SBT', 'WBL', 'WBR', 'WBT'];

const App = () => {
  const [apiData, setApiData] = useState([]);
  const [chartData, setChartData] = useState();
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (selectedOption !== '') {
      getDatabyName(selectedOption);
    }
  }, [selectedOption])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: `Movement data for ${selectedOption}`
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          pinch: {
            enabled: true
          },
          wheel: {
            enabled: true
          },
          mode: 'x',
        }
      }
    }
  };

  const getDatabyName = (field) => fetch(`http://localhost:4000/getData/${field}`).then((res) => res.json())
    .then(data => {
      setApiData(data);
      setChartFields(data);
    })

  const setChartFields = (data = apiData) => {
    const chartLabels = [];
    const chartDataSet = [];
    data.forEach(element => {
      const entDate = parseInt(element.entry_date);
      const date = `${new Date(entDate).getDate()}-${new Date(entDate).getMonth() + 1} - ${new Date(entDate).getHours()}:${new Date(entDate).getMinutes()}`
      chartLabels.push(date);
      chartDataSet.push(element.movements.Total);
    });
    const chart = {
      labels: chartLabels,
      datasets: [
        {
          label: `${selectedOption} Movement Count`,
          data: chartDataSet,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    setChartData(chart);
  };

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-center">
          <Col sm={8} md={4} className="mb-3">
            <Form.Label htmlFor="select-type">Select Field to Display</Form.Label>
            <Form.Select onChange={(e) => setSelectedOption(e.target.value)} id="select-type">
              <option>--Select Type--</option>
              {fields.map((opt, i) => <option key={`${opt}-${i}`}>{opt}</option>)}
            </Form.Select>
          </Col>
          <Col sm={12}>
            {chartData ? (
              <div className="chart-area">
                <Line options={chartOptions} data={chartData} />
              </div>
            ) : <p>Please select some data to display Chart</p>}
          </Col>
        </Row>
      </Container>
    </div >
  );
}

export default App;
