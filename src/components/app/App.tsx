import { CanvasScene } from "../CanvasScene/CanvasScene";
import { ViewportProvider } from "./providers/viewport-provider";

function App() {
  return (
    <ViewportProvider>
      <CanvasScene />
    </ViewportProvider>
  );
}

export default App;
