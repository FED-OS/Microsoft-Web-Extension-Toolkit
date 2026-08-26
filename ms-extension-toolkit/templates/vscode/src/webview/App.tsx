import { useState } from 'react';

/** Acquire the VS Code API handle for posting messages to the extension host. */
const vscode = (typeof acquireVsCodeApi !== 'undefined'
  ? acquireVsCodeApi()
  : { postMessage: (_m: unknown) => console.log('mock postMessage') }) as {
  postMessage: (msg: unknown) => void;
};

export default function App() {
  const [count, setCount] = useState(0);

  const sendHello = () => {
    vscode.postMessage({ type: 'hello' });
  };

  return (
    <div style={{ padding: 24, fontFamily: 'var(--vscode-font-family)', color: 'var(--vscode-foreground)' }}>
      <h1 style={{ fontSize: 20, marginTop: 0 }}>My VS Code Extension</h1>
      <p style={{ opacity: 0.8 }}>This is a React webview inside VS Code.</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => setCount((c) => c + 1)} style={btnStyle}>
          Count: {count}
        </button>
        <button onClick={sendHello} style={btnStyle}>
          Send hello to host
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 13,
  cursor: 'pointer',
  background: 'var(--vscode-button-background)',
  color: 'var(--vscode-button-foreground)',
  border: 'none',
  borderRadius: 2,
};
