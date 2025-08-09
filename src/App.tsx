import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Header from "./pages/Header";

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div>
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;
