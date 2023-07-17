import { useEffect, useState } from "react";
import { Pocketfm } from "./pocketfm";
import { Kukufm } from "./kukufm";
export function App() {
  const [app, setApp] = useState([]);

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    let app = params.app;
    console.log();
    setApp(app);
  }, []);
  if (app === "kuku") {
    return <Kukufm />;
  }
  if (app === "pfm") {
    return <Pocketfm />;
  }
  return "Please Pass APP NAME"
}
