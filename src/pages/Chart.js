import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#74c47a', "#C23237"];

const transformData = (data) => {
  console.log("Datos recibidos:", data); // Verifica qué datos estás recibiendo
  const votesEffectedLength = data.filter(person => person.isRegistered).length;
  const registeredVotings = data.length;
  const votesEffected = votesEffectedLength;
  const remainingVotes = data.length - votesEffectedLength;

  console.log("Registrados:", registeredVotings);
  console.log("Votos efectuados:", votesEffected);
  console.log("Votos restantes:", remainingVotes)

  return [
    { name: 'Cantidad de votantes: '+ registeredVotings, value: registeredVotings },
    { name: 'Votos efectuados: ' + votesEffected , value: votesEffected },
    { name: 'Votos restantes: ' + remainingVotes, value: remainingVotes },
  ];
};
function Chart() {
  const baseUrl = "https://localhost:44361/votingsStream";
  const [data, setData] = useState([]); // Inicializa data como un arreglo vacío

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(baseUrl)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("Connection established");

        // Invoke method and wait for response
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

      // Actualiza el estado con los datos recibidos
      setData(person);
    });

    // Limpia la conexión cuando el componente se desmonta
    return () => {
      connection.stop()
        .then(() => {
          console.log("Connection stopped");
        })
        .catch(error => {
          console.error("Error stopping connection:", error);
        });
    };
  }, []); // Asegúrate de que el efecto se vuelva a ejecutar cuando los datos cambien

  const transformedData = transformData(data);

  return (
    <div className="container">
      <h1>Informe de estadísticas</h1>
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
      </div>
    </div>
  );
}

export default Chart;
