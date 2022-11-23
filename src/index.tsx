import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const initialize = async () => {
    try {
      await esbuild.initialize({
        worker: true,
        wasmURL: '/esbuild.wasm',
      });
    } catch (err) {}
  };

  useEffect(() => {
    initialize();
  }, []);
  const onClick = async () => {
    try {
      const res = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin()],
      });
      setCode(res.outputFiles[0].text);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};
let root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
