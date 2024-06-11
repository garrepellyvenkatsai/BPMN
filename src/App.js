import React, { useState, useRef } from 'react';
import BpmnDiagram from './BpmnDiagram';

const App = () => {
  const [bpmnXml, setBpmnXml] = useState(null);
  const bpmnDiagramRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBpmnXml(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadXML = async () => {
    if (bpmnDiagramRef.current) {
      const xml = await bpmnDiagramRef.current.exportDiagram();
      if (xml) {
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.bpmn';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div>
      <h1>BPMN Diagram Generator</h1>
      <input type="file" accept=".xml" onChange={handleFileUpload} />
      {bpmnXml ? (
        <div>
          <BpmnDiagram ref={bpmnDiagramRef} xml={bpmnXml} />
          <button onClick={handleDownloadXML}>Download BPMN Diagram XML</button>
        </div>
      ) : (
        <p>Please upload a BPMN XML file to display the diagram.</p>
      )}
    </div>
  );
};

export default App;
