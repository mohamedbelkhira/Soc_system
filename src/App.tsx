import { SWRConfig } from "swr";

import { SWRGlobalConfig } from "./config/srw.js";
import { AuthProvider } from "./contexts/auth-provider";
import { ThemeProvider } from "./contexts/theme-provider.js";
import AppRoutes from "./routes/index.js";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="App">
          <SWRConfig value={SWRGlobalConfig}>
            <AppRoutes />
          </SWRConfig>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
