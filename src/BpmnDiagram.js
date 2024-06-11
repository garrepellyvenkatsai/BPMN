import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

const BpmnDiagram = forwardRef(({ xml }, ref) => {
  const containerRef = useRef(null);
  const bpmnModelerRef = useRef(null);

  useEffect(() => {
    const bpmnModeler = new BpmnJS({
      container: containerRef.current
    });
    bpmnModelerRef.current = bpmnModeler;

    async function renderDiagram() {
      try {
        await bpmnModeler.importXML(xml);
        bpmnModeler.get('canvas').zoom('fit-viewport');
      } catch (error) {
        console.error('Error rendering BPMN diagram', error);
      }
    }

    if (xml) {
      renderDiagram();
    }

    return () => bpmnModeler.destroy();
  }, [xml]);

  useImperativeHandle(ref, () => ({
    async exportDiagram() {
      try {
        const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
        return xml;
      } catch (error) {
        console.error('Error exporting BPMN diagram', error);
        return null;
      }
    }
  }));

  return <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />;
});

export default BpmnDiagram;
