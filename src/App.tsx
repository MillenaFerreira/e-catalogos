import { RouterProvider } from "react-router-dom";
import { PriceProvider } from "./context/PriceContext";
import router from "./routes/router";

function App() {
  return (
    <PriceProvider>
      <RouterProvider router={router} />
    </PriceProvider>
  );
}

export default App;
