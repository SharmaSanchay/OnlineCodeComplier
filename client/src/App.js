import './App.css';
import axios from "axios";
import React,{useState} from "react"; 
function App() {
  const [code, setCode] = useState("");
  const [language,setLanguage] = useState("cpp");
  const  [output,setOutput] = useState("");
  const [status,setStatus] = useState("");
  const [jobId,setJobId] = useState("") 
  const handleSubmit = async ()=>{
    console.log(code);
    const payload = {
      language,
      code
    }
    try{
      setJobId("");
      setStatus("");
      setOutput("");
      const { data } = await axios.post("http://localhost:8000/run", payload);
      console.log(data);
    setJobId(data.jobId);
  let intervalId;
  intervalId = setInterval(async ()=>{
    const {data:dataRes} = await axios.get("http://localhost:8000/status",{params:{id:data.jobId}});
    const{success,job,error} = dataRes;
    console.log(dataRes);
    if(success){
      const{status:jobStatus,output:jobOutput} = job;
      setStatus(jobStatus)
      if(jobStatus === "pending"){
        return ;
      }
      setOutput(jobOutput);
      clearInterval(intervalId);
    }
    else{
      setStatus("error please try again")
      clearInterval(intervalId);
      console.log(error);
      setOutput(error)
    }
  },1000)
    }
    catch (error) {
      if (error.response){
        console.log(error.response)
        if (!error.response.data.success){
            setOutput("OOPS something went wrong!!")
           }
      }else{
        setOutput("Error connecting  to server")
      }
    }
    }
    return (
    <div className="App" >
      <h1 id="heading">Online Code Complier</h1>
      <div class="header">
      <label id="lang">Language:</label>
      <select id ="sel" value={language} onChange={(e)=>{
        setLanguage(e.target.value);
         console.log(e.target.value); 
      }}>
        <option id="ot" value="cpp">C++</option>
        <option id="ot" value="py">Python</option>
        <option id="ot" value="java">Java</option>
      </select>
        </div><br/>
        <div class="code-editor">
          <pre class="line-numbers"></pre>
           <textarea rows="20" cols="75" id="codepart" value={code} onChange={(e)=>{
setCode(e.target.value);
      }}></textarea>
        </div>
      <br></br>
        <div id="execute">
          <button onClick={handleSubmit} id="btn"  type="submit">Submit</button>
        </div>
        <div class="result">
          <p>{status}</p>
        <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
        <p>{output}</p>
        </div>
        
    </div>
  );
}

export default App;
