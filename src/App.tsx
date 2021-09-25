import React from 'react';
import { process } from './lib'

function App() {
  const [err, setErr] = React.useState<string | undefined>()
  const [result, setResult] = React.useState<string | undefined>()

  return (
    <div className="App">
      <p>Upload your file:</p>
      <input type="file" accept=".pdf,application/pdf" onChange={(e) => {
        if (!e.target.files || e.target.files.length < 1) {
          setErr('No file selected, please select one')
          return;
        }
        if (e.target.files.length > 1) {
          setErr('Multiple files selected, please select only one')
          return;
        }
        setErr(undefined);
        process(e.target.files[0])
          .then((res) => {
            setErr(undefined);
            setResult(res);
          })
          .catch((err) => {
            setErr(String(err));
          })
      }} />
      {err && <p>Error: <code>{err}</code></p>}
      {result && <>
        <p>Result:</p>
        <embed src={result} width={900} height={400} />
      </>}
    </div>
  );
}

export default App;
