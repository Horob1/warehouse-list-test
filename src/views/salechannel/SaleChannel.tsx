import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Tooltip,
} from "@mantine/core";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { TblDMSaleChannel } from "./TblDMSaleChanel";
import { paginationBase } from "../../utils/pagination";
import axios from "./../../api/axios_mdm";
import BreadcrumbLayout from "../../components/breadcrumb/_breadcrumb";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  useMantineReactTable,
} from "mantine-react-table";
import {
  IconActivity,
  IconEdit,
  IconEye,
  IconHandStop,
  IconTrash,
} from "@tabler/icons-react";

export const SaleChanel = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [data, setData] = useState<TblDMSaleChannel[]>([]);
  const [pagination, setPagination] = useState(paginationBase);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available
  const [height, setHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const columns = useMemo<MRT_ColumnDef<TblDMSaleChannel>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Kênh bán hàng",
        Cell: ({ renderedCellValue }) => (
          <Badge
            radius={"sm"}
            variant="dot"
            size="lg"
            color={renderedCellValue === null ? "red" : "#21d01b"}
          >
            {renderedCellValue === null ? null : renderedCellValue}
          </Badge>
        ),
      },
      {
        accessorKey: "name",
        header: "Kênh bán hàng",
      },
      {
        accessorKey: "active",
        header: "Sử dụng",
        filterFn: "equals",
        mantineFilterSelectProps: {
          data: [
            { label: "Đang sử dụng", value: "true" },
            { label: "Dừng sử dụng", value: "false" },
          ],
        },
        filterVariant: "select",
        Cell: ({ renderedCellValue }) => (
          <Badge radius={"md"} color={renderedCellValue ? "green" : "red"}>
            {renderedCellValue ? "Đang sử dụng" : "Dừng sử dụng"}
          </Badge>
        ),
      },
      {
        accessorKey: "actions",
        header: "Thao tác",
        enableSorting: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Box
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <Tooltip label="Chỉnh sửa">
              <ActionIcon variant="light" aria-label="Settings" color="orange">
                <IconEdit size={20} stroke={1.5}></IconEdit>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Chi tiết">
              <ActionIcon variant="light" aria-label="Settings" color="cyan">
                <IconEye size={20} stroke={1.5}></IconEye>
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={row.original.active === true ? "Dừng sử dụng" : "Sử dụng"}
            >
              <ActionIcon
                variant="light"
                aria-label="Settings"
                color={row.original.active === true ? "violet" : "green"}
              >
                {row.original.active === true ? (
                  <IconHandStop size={20} />
                ) : (
                  <IconActivity size={20} />
                )}
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Xóa">
              <ActionIcon variant="light" aria-label="Settings" color="red">
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    data,
    columns,
    rowCount,
    mantineTableContainerProps: {
      style: {
        maxHeight: height,
        minHeight: height,
      },
    },
    // enableTopToolbar: false,
    manualPagination: true,
    enableRowSelection: true,
    renderTopToolbarCustomActions: () => <div ref={headerRef}></div>,
    renderToolbarInternalActions: () => (
      <Flex
        direction="row"
        style={{
          justifyContent: "end",
          padding: "16px",
        }}
        gap={"8px"}
      >
        <Button leftSection={<IoMdAdd />} variant="outline">
          Thêm mới
        </Button>
        <Button
          leftSection={<RiDeleteBinLine />}
          disabled={true}
          variant="outline"
        >
          Xóa (đã chọn)
        </Button>
        <Button rightSection={<FaChevronDown />} variant="outline">
          Chức năng
        </Button>
      </Flex>
    ),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      rowSelection,
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    setIsRefetching(true);
    setIsError(false);

    try {
      const url = `?Skip=${pagination.pageIndex * pagination.pageSize}&Take=${
        pagination.pageSize
      }`;

      const response = await axios.get("/v1/TblDmSaleChanel/get-all" + url);
      const result = response.data;
      if (result && result.success === true) {
        setData(result.data);
        setRowCount(result.totalCount);
      } else setData([]);
    } catch (error) {
      setIsError(true);
      setData([]);
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    const headerHeight = headerRef?.current?.offsetHeight || 0;

    const handleResize = () => {
      setHeight(window.innerHeight - (headerHeight + 200));
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    console.log("Rerender");
  });
  return (
    <Container fluid>
      <BreadcrumbLayout />
      <MantineReactTable table={table} />
    </Container>
  );
};
