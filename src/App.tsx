import { MantineProvider } from "@mantine/core";
import { WarehouseInward } from "./views/warehouse/WarehouseInward";
import "@mantine/core/styles.css"; //import Mantine V7 styles needed by MRT
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { SaleChanel } from "./views/salechannel/SaleChannel";
import { ModalsProvider } from "@mantine/modals";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        <Link to={"/warehouse"}>warehouse</Link>
        <Link to={"/salechanel"}>salechanel</Link>
        
      </div>
    ),
  },
  {
    path: "/warehouse",
    element: <WarehouseInward />,
  },
  {
    path: "/salechanel",
    element: <SaleChanel />,
  },
]);
function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <RouterProvider router={router}></RouterProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
