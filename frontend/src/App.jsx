import { useState } from "react";

const BACKEND_URL = "http://localhost:9092";

export default function App() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [status, setStatus] = useState("idle");
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMensaje("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, clave }),
      });

      if (!response.ok) throw new Error("bad-response");

      const data = await response.json();
      setMensaje(data.mensaje);

      if (data.autenticado) setStatus("success");
      else if (data.existe) setStatus("denied");
      else setStatus("unknown");
    } catch (err) {
      setStatus("offline");
      setMensaje("No se pudo conectar con el backend");
    }
  }

  return (
    <div className="page page--centered">
      <div className="card">
        <h1>Iniciar sesion</h1>
        <p className="subtitle">Verifica tus credenciales contra el backend.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="usuario">usuario</label>
          <input
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Admin"
            autoComplete="username"
            required
          />

          <label htmlFor="clave">clave</label>
          <input
            id="clave"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "verificando…" : "ingresar"}
          </button>
        </form>

        {mensaje && (
          <p className={`status status--${status}`}>
            <span className="status__prefix">$ status:</span> {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
