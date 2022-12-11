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

const shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const App = () => {
  const [apiData, setApiData] = useState([]);
  const [chartData, setChartData] = useState();
  const [fieldList, setFieldList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDated] = useState('');
  const [interval, setInterval] = useState(900000);

  useEffect(() => {
    fetch(`http://localhost:4000/getOptions`).then((res) => res.json())
      .then(data => {
        setDateList(data.dateList);
        setFieldList(data.fieldList);
      })
  }, []);

  useEffect(() => {
    if (apiData.length) {
      console.log('called');
      setChartFields();
    }
  }, [interval])

  useEffect(() => {
    if (selectedOption !== '' && selectedDate !== '') {
      getDatabyName(selectedOption, selectedDate);
    }
  }, [selectedOption, selectedDate]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: `Movement data for ${selectedOption} on ${selectedDate}`
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

  const getDatabyName = (field, date) => fetch(`http://localhost:4000/getData`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movementDate: date,
      field: field
    })
  }).then((res) => res.json())
    .then(data => {
      setApiData(data);
      setChartFields(data);
    })

  const setChartFields = (data = apiData) => {
    const chartLabels = [];
    const chartDataSet = [];
    data.forEach(element => {
      const curDate = parseInt(element.entry_date);
      if (interval > 900000 && (curDate - chartLabels[chartLabels.length - 1]) <= interval) {
        chartDataSet[chartDataSet.length - 1] += element.movements.Total;
      } else {
        chartLabels.push(curDate);
        chartDataSet.push(element.movements.Total);
      }
    });
    const chart = {
      labels: chartLabels.map(date => {
        const entDate = new Date(date);
        return `${entDate.getDate()} ${shortMonth[entDate.getMonth()]} - ${entDate.getHours()}:${new Date(entDate).getMinutes()}`
      }),
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
            <Form.Label htmlFor="select-date">Select Date</Form.Label>
            <Form.Select onChange={(e) => setSelectedDated(e.target.value)} id="select-date">
              <option value="">--Select Date--</option>
              {dateList.map((opt, i) => <option key={`${opt}-${i}`}>{opt}</option>)}
            </Form.Select>
          </Col>
          <Col sm={8} md={4} className="mb-3">
            <Form.Label htmlFor="select-type">Select Field to Display</Form.Label>
            <Form.Select onChange={(e) => setSelectedOption(e.target.value)} id="select-type">
              <option value="">--Select Type--</option>
              {fieldList.map((opt, i) => <option key={`${opt}-${i}`}>{opt}</option>)}
            </Form.Select>
          </Col>
          <Col sm={12}>
            {chartData ? (
              <div className="chart-area">
                <div className="mb-3">
                  <Form.Check
                    inline
                    label="15 mins"
                    name="interval"
                    type="radio"
                    id="15-min"
                    checked={interval === 900000}
                    onChange={() => setInterval(900000)}
                  />
                  <Form.Check
                    inline
                    label="30 mins"
                    name="interval"
                    type="radio"
                    id="30-min"
                    checked={interval === 1800000}
                    onChange={() => setInterval(1800000)}
                  />
                  <Form.Check
                    inline
                    label="1 hr"
                    name="interval"
                    type="radio"
                    id="1-hr"
                    checked={interval === 3600000}
                    onChange={() => setInterval(3600000)}
                  />
                  <Form.Check
                    inline
                    label="2 hrs"
                    name="interval"
                    type="radio"
                    id="2-hr"
                    checked={interval === 7200000}
                    onChange={() => setInterval(7200000)}
                  />
                </div>
                <Line options={chartOptions} data={chartData} />
              </div>
            ) : <p>Please select Date and field to display Chart</p>}
          </Col>
        </Row>
      </Container>
    </div >
  );
}

export default App;
