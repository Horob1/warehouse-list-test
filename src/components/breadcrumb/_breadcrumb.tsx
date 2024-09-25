import { Anchor, Breadcrumbs } from "@mantine/core";
import { useLocation } from "react-router-dom";

const BreadcrumbLayout = () => {
  const location = useLocation();

  const items = location.pathname.split("/");

  items[0] = "home";

  return (
    <Breadcrumbs
      style={{
        padding: "16px",
      }}
      className="breadcrumb"
    >
      {items.map((item, index) => (
        <Anchor href={item === "home" ? "/" : `/${item}`} key={index}>
          {item}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbLayout;
