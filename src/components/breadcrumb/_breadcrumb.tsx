import { Anchor, Breadcrumbs } from "@mantine/core";

const BreadcrumbLayout = () => {
  const items = [
    { title: "Trang chủ", href: "#" },
    { title: "Cấu hình kho hàng", href: "#" },
    { title: "Phiếu nhập kho", href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));
  return <Breadcrumbs className="breadcrumb">{items}</Breadcrumbs>;
};

export default BreadcrumbLayout;
