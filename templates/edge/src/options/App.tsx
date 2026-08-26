import { useEffect, useState } from 'react';
import type { UserPreferences } from '@/types';
import { storage } from '@/lib/config';

export default function App() {
  const [prefs, setPrefs] = useState<UserPreferences>({ exampleSetting: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.getPreferences().then(setPrefs);
  }, []);

  const save = async () => {
    await storage.setPreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Configure your extension preferences here.</p>

      <section className="mt-8 rounded-xl border border-slate-200 p-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={prefs.exampleSetting}
            onChange={(e) => setPrefs((p) => ({ ...p, exampleSetting: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300"
          />
          Example setting
        </label>
      </section>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="rounded-lg bg-msblue px-5 py-2 text-sm font-semibold text-white hover:bg-msblue-dark">
          Save
        </button>
        {saved && <span className="text-sm text-emerald-600">✓ Saved!</span>}
      </div>
    </div>
  );
}
