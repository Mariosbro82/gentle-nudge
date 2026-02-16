import { useState, useEffect } from "react";

const SITE_PASSWORD = "nfcwear2026";
const STORAGE_KEY = "nfcwear_site_access";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "granted") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "granted");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authorized) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">🔒 NFCwear</h1>
          <p className="text-sm text-zinc-400">
            Diese Seite befindet sich noch im Aufbau. Bitte gib das Passwort ein.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Passwort"
          autoFocus
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {error && (
          <p className="text-sm text-red-400">Falsches Passwort.</p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
        >
          Zugang erhalten
        </button>
      </form>
    </div>
  );
}
