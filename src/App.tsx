import React from 'react';
import { process } from './lib'

function App() {
  const [error, setError] = React.useState<string | undefined>()
  const [message, setMessage] = React.useState<string | undefined>()
  const [result, setResult] = React.useState<string | undefined>()
  const [hovering, setHovering] = React.useState<boolean | undefined>()
  const [fileName, setFileName] = React.useState<string | undefined>()

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

    process(files[0], setMessage)
      .then((res) => {
        setMessage(undefined);
        setResult(res);
        setFileName(files[0].name.slice(0, -4) + " scanned.pdf");
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
    if (acceptingFile) {
      setHovering(true);
    }
  }

  const dragLeaveHandler = (ev: React.DragEvent) => {
    if (acceptingFile) {
      if (!ev.relatedTarget || !document.getElementById('drop_zone')?.contains(ev.relatedTarget as Node)) {
        setHovering(false)
      }
    }
  }

  const download = (url: string, fileName: string = 'scan.pdf') => {
    const a: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="App">
      <div className="container">
        <svg width={64} height={64} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect style={{ opacity: 1, fill: "#ab47bc", fillOpacity: 1, fillRule: "evenodd", stroke: "#ab47bc", strokeWidth: 0, strokeLinecap: "round", strokeLinejoin: "bevel", strokeMiterlimit: 4, strokeDasharray: "none", strokeDashoffset: 0, strokeOpacity: 1, paintOrder: "stroke markers fill" }} width={32} height={32} ry={2} /><path style={{ opacity: 1, fill: "none", fillOpacity: 1, fillRule: "evenodd", stroke: "#fff", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 4, strokeDasharray: "none", strokeDashoffset: 0, strokeOpacity: 1, paintOrder: "stroke markers fill" }} d="M8 8h9l7 7v9H8Z" /><path style={{ fill: "none", stroke: "#fff", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 4, strokeDasharray: "none", strokeOpacity: 1 }} d="M5 23v4h4M9 5H5v4m22 0V5h-4m4 18v4h-4M17 8v7h7" /></svg>
        <h1>PDF scanner</h1>
        <p>Need your PDF to look like it's been scanned but can't be bothered to scan it? This tool is the solution to make your PDF look like it was scanned! Upload your PDF below and let the fake scanner do its magic (this might take some time for larger documents).</p>
      </div>
      <div id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 190 1440 80"><path fill={hovering ? '#EEEEEE' : '#E0E0E0'} d="M0,256L120,256C240,256,480,256,720,245.3C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
        <div style={{ backgroundColor: hovering ? '#EEEEEE' : '#E0E0E0' }}>
          <div className="container">
            {acceptingFile && <>
              {!hovering && <label className="button">
                Choose file
                <input type="file" accept=".pdf,application/pdf" onChange={(e) => onChange(e.target.files)} hidden />
              </label>}
              {hovering && <p style={{ padding: '6.2px' }}>Drop your file here!</p>}
              {error && <p className="upload_error">Error: {error}</p>}
              <p className="upload_subtitle">Documents don't leave your computer. Max 10 pages recommended.</p>
            </>}
            {message && <>
              <div className="loader"></div>
              <p>{message}</p>
            </>}
            {result && <>
              <h2 style={{ marginTop: '-1rem' }}>Finished scanning document!</h2>
              <button className="button" onClick={() => download(result, fileName)}>Download</button>
              <embed src={result} style={{ width: '100%' }} width={800} height={800} />
              <button className="button button-overwrite" onClick={() => {
                setError(undefined);
                setResult(undefined);
                setMessage(undefined);
              }}>Start over</button>
            </>
            }
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 40 1440 95"><path fill={hovering ? '#EEEEEE' : '#E0E0E0'} d="M0,128L120,112C240,96,480,64,720,53.3C960,43,1200,53,1320,58.7L1440,64L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg>
      </div>
      <div className="container">
        <h2>When would I make a PDF look like it's scanned?</h2>
        <p>Printer run out of ink? Don't have a printer or scanner at all? That can be a problem if you've been asked for a document that needs to look like it's been scanned. Even if you do have the equipment, complying with a silly bureaucratic processes can waste time, especially with the pain of debugging printer and scanner issues. With this PDF scanner tool, you'll get documents that look like they were printed and scanned with ease!</p>
        <p>Tools like <a href="https://www.sejda.com/" target="_blank" rel="noreferrer">Sedja</a> and <a href="https://smallpdf.com/" target="_blank" rel="noreferrer">Smallpdf</a> are brilliant for editing documents, such as adding text or applying digital signatures. Other tools, like <a href="https://support.apple.com/guide/preview/welcome/mac" target="_blank" rel="noreferrer">Apple Preview</a> and <a href="https://www.adobe.com/acrobat.html" target="_blank" rel="noreferrer">Adobe Acrobat</a> also support PDF editing and can apply digital signatures. But, they lack this cruicial feature to meet bureaucratic organisations' requirements.</p>

        <h2>How do we compare to others?</h2>
        <p>We pride ourselves in making documents that really look like genuine scans, no matter what shape or size PDF you upload. There are some other good tools out there, but we made this because in certain edge cases we didn't think they quite cut it - or had prohibitively low usage limits. Compared to other fake scanner, fake printing and fake faxing apps we think we do a good job at getting you a quality result and with absolutely no limits. Not only that, but unlike other services your PDF documents don't leave your computer, for greater security.</p>

        <h2>Is my data secure?</h2>
        <p>While we make no guarantees about security, this tool has been designed to keep your documents on your computer while they get turned into scanned versions so we don't even see them. That way, it's harder for them to fall into the hands of attackers and your information stays private.</p>

        <h2>What else should I know before using this tool?</h2>
        <p>Use of this tool is at your own risk, and you should make sure you comply with any relevant laws or regulations in using it. This tool is great for making your PDF document look scanned, but if a real physical document is required for something important you might be better off dusting off your printer, asking to borrow one from a friend or heading to the library to get it sorted. There are also apps like Microsoft Lens for <a href="https://apps.apple.com/app/id975925059" target="_blank" rel="noreferrer">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.microsoft.office.officelens" target="_blank" rel="noreferrer">Android</a>, or <a href="https://thegrizzlylabs.com/genius-scan/" target="_blank" rel="noreferrer">Genius Scan</a> out there if you're mainly looking for scanning functionality of physical documents.</p>
      </div>
    </div>
  );
}

export default App;
