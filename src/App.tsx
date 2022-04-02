import React from 'react';
import { process } from './lib'

function App() {
  const [error, setError] = React.useState<string | undefined>()
  const [message, setMessage] = React.useState<string | undefined>()
  const [result, setResult] = React.useState<string | undefined>()
  const [hovering, setHovering] = React.useState<boolean | undefined>()

  const acceptingFile = !result && !message;

  const onChange = (files: File[] | FileList | null) => {
    setError(undefined);
    setMessage(undefined);
    setResult(undefined);
    setHovering(false);

    if (!files || files.length < 1) {
      return;
    }
    if (files.length > 1) {
      setError('Multiple files selected, please select only one')
      return;
    }

    setMessage('Processing file...');

    process(files[0])
      .then((res) => {
        setMessage(undefined);
        setResult(res);
      })
      .catch((err) => {
        setMessage(undefined);
        console.error(err);
        const errMessage = typeof err === "string" ? err : "The file is not a valid PDF document, or is too big to process."
        setError(errMessage);
      })
  }

  const dropHandler = (ev: React.DragEvent) => {
    // Prevent file from being opened
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      const files: File[] = []

      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          let file = ev.dataTransfer.items[i].getAsFile();
          if (file !== null) {
            files.push(file)
          }
        }
      }

      onChange(files)
    } else {
      // Use DataTransfer interface to access the file(s)
      onChange(ev.dataTransfer.files)
    }
  }

  const dragOverHandler = (ev: React.DragEvent) => {
    // Prevent file from being opened
    ev.preventDefault();
  }

  const dragEnterHandler = (ev: React.DragEvent) => {
    console.log('enter!')
    setHovering(true);
  }

  const dragLeaveHandler = (ev: React.DragEvent) => {
    if (!ev.relatedTarget || !document.getElementById('drop_zone')?.contains(ev.relatedTarget as Node)) {
      setHovering(false)
    }
  }

  return (
    <div className="App">
      <div>
        <div className="container">
          <h1>PDF scanner</h1>
          <p>Need your PDF to look like it's been scanned but can't be bothered to scan it? This tool is the solution to make your PDF look like it was scanned! Upload your PDF below and let the fake scanner do its magic (this might take some time for larger documents).</p>
        </div>
        <div id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 190 1440 80"><path fill={hovering ? '#EEEEEE' : '#E0E0E0'} d="M0,256L120,256C240,256,480,256,720,245.3C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
          <div style={{ backgroundColor: hovering ? '#EEEEEE' : '#E0E0E0' }}>
            <div className="container">
              {acceptingFile && <>
                {!hovering && <label className="input-file">
                  Choose file
                  <input type="file" accept=".pdf,application/pdf" onChange={(e) => onChange(e.target.files)} hidden />
                </label>}
                {hovering && <p style={{ padding: '6.5px' }}>Drop your file here!</p>}
                {error && <p className="upload_error">Error: {error}</p>}
                <p className="upload_subtitle">Documents don't leave your computer. Max 10 pages recommended.</p>
              </>}
              {message && <>
                <div className="loader"></div>
                <p>{message}</p>
              </>}
              {result && <>
                <p>Result:</p>
                <embed src={result} style={{ width: '100%' }} width={800} height={800} />
              </>
              }
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 40 1440 95"><path fill={hovering ? '#EEEEEE' : '#E0E0E0'} d="M0,128L120,112C240,96,480,64,720,53.3C960,43,1200,53,1320,58.7L1440,64L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg>
        </div>
      </div >
    </div >
  );
}

export default App;
