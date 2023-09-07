import { HubConnectionBuilder } from '@microsoft/signalr'
import React, {useEffect} from 'react'

function Connection() {

  const baseUrl = "https://localhost:44361/votings";
;

  return (
    useEffect(() => {
        const connection = new HubConnectionBuilder().withUrl(baseUrl).withAutomaticReconnect().build()

        connection.start()
        .then(result => {
            console.log("Connected");

            connection.on("Recieve")
        })
        .catch(e => console.log("Connection failed: " + e))
    }, []));
  
}

export default Connection