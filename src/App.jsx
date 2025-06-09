// src/App.jsx
import React from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes.jsx";
import { Toaster } from "react-hot-toast";

export const App = () => {
  const element = useRoutes(routes);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* 
        main ocupará todo el espacio restante (anchura=100%, altura=100%),
        y hará scroll si el contenido desborda. 
      */}
      <main className="flex-1 w-full h-full overflow-auto">
        {element}
      </main>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
