import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#74c47a', "#C23237"];
let totalVoters = 0;
const transformData = (data) => {
  console.log("Datos recibidos:", data);
  const votesEffectedLength = data.filter(person => person.isRegistered).length;
  const registeredVotings = data.length;
  const votesEffected = votesEffectedLength;
  const remainingVotes = data.length - votesEffectedLength;
  totalVoters = registeredVotings
  console.log("Registrados:", registeredVotings);
  console.log("Votos efectuados:", votesEffected);
  console.log("Votos restantes:", remainingVotes)

  return [
    
    { name: 'Votos efectuados: ' + votesEffected, value: votesEffected },
    { name: 'Votos restantes: ' + remainingVotes, value: remainingVotes },
  ];
};

function Chart() {
  const baseUrl = "https://localhost:44361/votingsStream";
  const [data, setData] = useState([]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(baseUrl)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("Connection established");
        connection.invoke('GetDataFromDb')
          .catch(error => {
            console.error("Error invoking method:", error);
          });
      })
      .catch(error => {
        console.error("Connection failed:", error);
      });

    connection.on("Data", function (person) {
      console.log("Received data from server:", person);
      setData(person);
    });

    return () => {
      connection.stop()
        .then(() => {
          console.log("Connection stopped");
        })
        .catch(error => {
          console.error("Error stopping connection:", error);
        });
    };
  }, []);

  const transformedData = transformData(data);

  return (
    <div className="container">
      <h1>Informe de estadísticas</h1>

      <div className="chartContainer">
        <div className='chart'>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              data={transformedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              fill="#8884d8"
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
          <div className="voters-count">
            Cantidad de votantes: {totalVoters}
          </div>
        </div>
        <div className='chart'>
          <BarChart
            width={700}
            height={400}
            data={transformedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} /> // Asigna colores personalizados
            ))}
            <Legend />
            </Bar>
          </BarChart>
          <div className="voters-count">
            Cantidad de votantes: {totalVoters}
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default Chart;
