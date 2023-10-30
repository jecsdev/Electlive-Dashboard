import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#74c47a', "#C23237"];

function transformData(data) {
  return data.reduce((result, person) => {
    result[person.isRegistered ? 'effected' : 'remaining']++;
    return result;
  }, { effected: 0, remaining: 0 });
}

function Chart() {
  const baseUrl = "https://localhost:44361/votingsStream";
  const [data, setData] = useState([]);
  const [votes, setVotes] = useState({ effected: 0, remaining: 0 });

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(baseUrl)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connection established");
        connection.invoke('GetDataFromDb').catch(error => console.error("Error invoking method:", error));
      } catch (error) {
        console.error("Connection failed:", error);
      }
    };

    connection.on("Data", function (person) {
      console.log("Received data from server:", person);
      setData(person);
      const votesData = transformData(person);
      setVotes(votesData);
    });

    startConnection();

    return () => {
      connection.stop().then(() => {
        console.log("Connection stopped");
      }).catch(error => {
        console.error("Error stopping connection:", error);
      });
    };
  }, []);

  return (
    <div className="container">
      <h1>Estado de las votaciones</h1>
      <h2>Municipio: Salcedo</h2>
      <div className="chartContainer">
        <div className='chart'>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              data={[
                { name: 'Votos efectuados: ' + votes.effected, value: votes.effected },
                { name: 'Votos restantes: ' + votes.remaining, value: votes.remaining }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              fill="#8884d8"
            >
              {votes.effected > 0 && <Cell key="cell-0" fill={COLORS[0]} />}
              {votes.remaining > 0 && <Cell key="cell-1" fill={COLORS[1]} />}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
          <div className="voters-count">
            Votos totales: {votes.effected + votes.remaining}
          </div>
        </div>
        <div className='chart'>
          <BarChart
            width={700}
            height={400}
            data={[
              { name: 'Votos efectuados: ' + votes.effected, value: votes.effected },
              { name: 'Votos restantes: ' + votes.remaining, value: votes.remaining }
            ]}
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
            <Bar dataKey="value" fill="#8884d8" label="">
              {votes.effected > 0 && <Cell key="cell-0" fill={COLORS[0]} />}
              {votes.remaining > 0 && <Cell key="cell-1" fill={COLORS[1]} />}
            </Bar>
          </BarChart>
          <div className="voters-count">
            Cantidad de votantes: {votes.effected + votes.remaining}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;

