import { useEffect, useState } from 'react';

/**
 * Task pane UI for the Office Add-in template.
 * Demonstrates detecting the host (Word/Excel/Outlook/PowerPoint) and
 * a simple action that inserts text into the document.
 */
export default function App() {
  const [host, setHost] = useState<string>('Detecting…');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Detect which Office host the add-in is running in
    if (Office.context?.host) {
      setHost(Office.HostType[Office.context.host]);
    } else {
      setHost('Unknown');
    }
  }, []);

  /** Insert sample text into a Word/Excel document. */
  const insertText = async () => {
    try {
      if (Office.context.host === Office.HostType.Word) {
        await Word.run(async (context) => {
          context.document.body.insertParagraph('Hello from My Office Add-in!', Word.InsertLocation.end);
          await context.sync();
        });
        setStatus('✓ Text inserted into Word document');
      } else if (Office.context.host === Office.HostType.Excel) {
        await Excel.run(async (context) => {
          const range = context.workbook.getSelectedRange();
          range.values = [['Hello from My Office Add-in!']];
          await context.sync();
        });
        setStatus('✓ Text inserted into Excel cell');
      } else if (Office.context.host === Office.HostType.PowerPoint) {
        setStatus('ℹ PowerPoint: customize with PowerPoint.run()');
      } else if (Office.context.host === Office.HostType.Outlook) {
        setStatus('ℹ Outlook: customize with Office.context.mailbox');
      } else {
        setStatus('ℹ Open this add-in in Word, Excel, PowerPoint, or Outlook to use this action.');
      }
    } catch (e) {
      setStatus(`✗ Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="h-full bg-white p-4 text-slate-800">
      <header className="mb-4 border-b border-slate-200 pb-3">
        <h1 className="text-lg font-semibold">My Office Add-in</h1>
        <p className="text-xs text-slate-500">Host: <strong>{host}</strong></p>
      </header>

      <button
        onClick={insertText}
        className="w-full rounded-lg bg-msblue px-3 py-2.5 text-sm font-semibold text-white hover:bg-msblue-dark"
      >
        Insert text into document
      </button>

      {status && (
        <p className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">{status}</p>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">
        Edit <code className="rounded bg-slate-100 px-1">src/taskpane/App.tsx</code> to build your add-in.
      </p>
    </div>
  );
}
