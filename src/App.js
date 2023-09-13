import './App.css';
import './index.css';
import Chart from './pages/Chart';
import { HubConnectionBuilder } from '@microsoft/signalr';
function App() {

  const baseUrl = "https://localhost:44361/votingsStream";
  const connection = new HubConnectionBuilder()
          .withUrl(baseUrl)
          .build();
  connection.start()
  return (
    <div className="App">
     {<Chart/>}
    </div>
  );
}


export default App;
