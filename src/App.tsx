import React from 'react';
import { process } from './lib'

function App() {
  const [message, setMessage] = React.useState<string | undefined>()
  const [result, setResult] = React.useState<string | undefined>()
  const ref = React.createRef<HTMLInputElement>();

  const onChange = (files: FileList | null) => {
    setResult(undefined);

    if (!files || files.length < 1) {
      setMessage('Error: No file selected, please select one')
      return;
    }
    if (files.length > 1) {
      setMessage('Error: Multiple files selected, please select only one')
      return;
    }

    setMessage('Processing file...');

    process(files[0], 150)
      .then((res) => {
        setMessage(undefined);
        setResult(res);
      })
      .catch((err) => {
        console.error(err);
        setMessage(String(err));
      })
  }

  return (
    <div className="App">
      <div>
        <p>Upload your file:</p>
        <button onClick={(e) => onChange(ref.current?.files ?? null)}>Regenerate</button>
        <input ref={ref} type="file" accept=".pdf,application/pdf" onChange={(e) => onChange(e.target.files)} />
        {message && <p><code>{message}</code></p>}
      </div>
      {result && <>
        <p>Result:</p>
        <embed src={result} style={{ width: '100%' }} width={900} height={800} />
      </>}
    </div>
  );
}

export default App;
