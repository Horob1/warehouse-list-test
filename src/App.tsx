import { MantineProvider } from "@mantine/core";
import { WarehouseInward } from "./views/WarehouseInward";
import "@mantine/core/styles.css"; //import Mantine V7 styles needed by MRT
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles

function App() {
  return (
    <MantineProvider>
      <WarehouseInward></WarehouseInward>
    </MantineProvider>
  );
}

export default App;
