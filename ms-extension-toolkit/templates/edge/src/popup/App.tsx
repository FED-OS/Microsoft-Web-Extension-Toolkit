import { useEffect, useState } from 'react';
import type { ExtensionMessage } from '@/types';

interface TabInfo {
  url: string;
  title: string;
}

export default function App() {
  const [tab, setTab] = useState<TabInfo | null>(null);
  const [pong, setPong] = useState<number | null>(null);

  useEffect(() => {
    // Ask the background worker for the active tab info
    chrome.runtime
      .sendMessage({ type: 'GET_TAB_INFO' } satisfies ExtensionMessage)
      .then((resp: ExtensionMessage) => {
        if (resp?.type === 'TAB_INFO') setTab(resp.payload);
      });
  }, []);

  const ping = () => {
    chrome.runtime
      .sendMessage({ type: 'PING' } satisfies ExtensionMessage)
      .then((resp: ExtensionMessage) => {
        if (resp?.type === 'PONG') setPong(resp.payload.timestamp);
      });
  };

  return (
    <div className="w-[360px] bg-white text-slate-800">
      <header className="bg-msblue px-4 py-3 text-white">
        <h1 className="text-base font-semibold">My Edge Extension</h1>
      </header>

      <div className="p-4">
        {tab && (
          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-400">Active tab</p>
            <p className="mt-1 truncate text-sm font-medium" title={tab.title}>
              {tab.title}
            </p>
            <p className="truncate text-xs text-slate-500" title={tab.url}>
              {tab.url}
            </p>
          </div>
        )}

        <button
          onClick={ping}
          className="w-full rounded-lg bg-msblue px-3 py-2.5 text-sm font-semibold text-white hover:bg-msblue-dark"
        >
          Ping background worker
        </button>

        {pong && (
          <p className="mt-2 text-center text-xs text-emerald-600">✓ Pong received at {new Date(pong).toLocaleTimeString()}</p>
        )}

        <p className="mt-4 text-center text-xs text-slate-400">
          Edit <code className="rounded bg-slate-100 px-1">src/popup/App.tsx</code> to build your UI.
        </p>
      </div>
    </div>
  );
}
