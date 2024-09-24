import "./warehouseInward.scss";
import {
  Badge,
  Button,
  Grid,
  Input,
  Select,
  Text,
  // Tooltip,
} from "@mantine/core";
import BreadcrumbLayout from "../components/breadcrumb/_breadcrumb";
import {
  IconBrandBootstrap,
  IconFileTypography,
  IconSearch,
  IconStatusChange,
  IconTimeDuration15,
  IconUserCode,
} from "@tabler/icons-react";
import { ITblOutwardSearchInput, TblOutwardGetList } from "./TblOutWard";
import React, { useEffect, useRef, useState } from "react";
import axios from "./../api/axios";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { DatePickerInput } from "@mantine/dates";
import { paginationBase } from "../utils/pagination";
import { convernDate } from "../utils/converntDate";

export const WarehouseInward = () => {
  const [data, setData] = useState<TblOutwardGetList[]>([]);
  const [pagination, setPagination] = useState(paginationBase);
  const [search, setSearch] = useState<ITblOutwardSearchInput>({
    key: "",
  });
  const headerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const fetchData = async () => {
    let url = `?Skip=${pagination?.pageIndex * pagination?.pageSize}&Take=${
      pagination.pageSize
    }`;
    if (search.key) {
      url += `&key=${search.key}`;
    }
    try {
      const response = await axios.get("/v1/Inward/get-list" + url);
      const result = response.data;
      setRowCount(result.data.totalCount);
      setData(result.data || []);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;

    const handleResize = () => {
      console.log(window.innerHeight);
      setHeight(window.innerHeight - (150 + headerHeight));
      console.log(height);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageSize, pagination.pageIndex]);

  const columns = React.useMemo<MRT_ColumnDef<TblOutwardGetList>[]>(
    () => [
      {
        accessorKey: "transactionCode",
        header: "Mã phiếu",
        size: 30,
        Cell: ({ renderedCellValue }) => (
          <Text fw={700} size="sm">
            {renderedCellValue}
          </Text>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 20,
        Cell: ({ row }) => (
          <>
            <Badge>{row.original.status}</Badge>
          </>
        ),
      },
      {
        accessorKey: "transactionDate",
        header: "Ngày giao dịch",
        size: 30,
        Cell: ({ row }) =>
          row.original.transactionDate ? (
            <Text size="sm">{convernDate(row.original.transactionDate)}</Text>
          ) : (
            ""
          ),
      },
      {
        accessorKey: "createDate",
        header: "Ngày lập",
        size: 30,
        Cell: ({ row }) => {
          return row.original.createDate ? (
            <Text size="sm">{convernDate(row.original.createDate)}</Text>
          ) : (
            ""
          );
        },
      },
      {
        accessorKey: "createName",
        header: "Người lập",
        size: 30,
      },

      {
        accessorKey: "sourceCode",
        header: "Mã chứng từ gốc",
        size: 30,
        Cell: ({ renderedCellValue }) => (
          <Text fw={700} size="sm">
            {renderedCellValue}
          </Text>
        ),
      },

      {
        accessorKey: "sourceType",
        header: "Loại chứng từ gốc",
        size: 30,
        Cell: ({ renderedCellValue }) => (
          <Text fw={700} size="sm">
            {renderedCellValue}
          </Text>
        ),
      },
      {
        accessorKey: "inventoryId",
        header: "Chi nhánh",
        size: 30,
        Cell: ({ renderedCellValue }) => (
          <Text size="sm">{renderedCellValue}</Text>
        ),
      },

      {
        accessorKey: "subInvName",
        header: "Kho",
        size: 30,
        Cell: ({ row }) => <Text size="11.5px">{row.original.subInvName}</Text>,
      },
    ],
    []
  );
  const table = useMantineReactTable({
    columns,
    data,
    enableTopToolbar: false,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination: pagination,
    },
    mantinePaginationProps: {
      showRowsPerPage: true,
      withEdges: true,
      rowsPerPageOptions: ["10", "20", "50"],
    },
    mantineTableContainerProps: {
      style: { maxHeight: height, minHeight: height },
    },
    paginationDisplayMode: "pages",
    enableColumnPinning: true,
    rowCount,
  });
  return (
    <div className="warehouse-inward">
      <div ref={headerRef}>
        <BreadcrumbLayout></BreadcrumbLayout>
        <Grid mt={"10px"}>
          <Grid.Col span={{ base: 6, sm: 4, md: 2, lg: 1.25 }}>
            <Input
              w={"100%"}
              placeholder="Từ khoá"
              type="text"
              leftSection={<IconSearch color="#15aabf" />}
              onChange={(e) => setSearch({ ...search, key: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4, md: 2, lg: 1.25 }}>
            <Select
              placeholder={"Trạng thái"}
              searchable
              clearable
              // data={}
              leftSection={<IconStatusChange color="#15aabf" />}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
              nothingFoundMessage={"Không có dữ liệu"}
              onChange={() => {}}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4, md: 2, lg: 1.25 }}>
            <Select
              placeholder={"Loại chứng từ gốc"}
              searchable
              clearable
              leftSection={<IconFileTypography color="#15aabf" />}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
              nothingFoundMessage={"Không có dữ liệu"}
              onChange={() => {}}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4, md: 2, lg: 1.25 }}>
            <Select
              searchable
              clearable
              placeholder="Chọn chi nhánh"
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
              leftSection={<IconBrandBootstrap color="#15aabf" />}
              nothingFoundMessage={"Không có dữ liệu"}
              onChange={() => {}}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4, md: 2, lg: 1.25 }}>
            <Select
              placeholder={"Chọn nhân viên"}
              searchable
              clearable
              leftSection={<IconUserCode color="#15aabf" />}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
              nothingFoundMessage={"Không có dữ liệu"}
              onChange={() => {}}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 8, sm: 6, md: 3.35, lg: 2.5 }}>
            <DatePickerInput
              // type="multiple"
              type="range"
              size="sm"
              allowSingleDateInRange
              placeholder="Chọn khoảng ngày"
              leftSection={<IconTimeDuration15 color="#15aabf" />}
              locale="vi"
              // value={value}
              valueFormat="DD/MM/YYYY"
              onChange={() => {}}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4, sm: 4, md: 1.5, lg: 1.25 }}>
            <Button
              leftSection={<IconSearch size={14} />}
              color="blue"
              variant="outline"
              onClick={async () => {
                await fetchData();
              }}
            >
              Tìm kiếm
            </Button>
          </Grid.Col>
        </Grid>
      </div>
      <div className="mt-5" style={{ marginTop: "10px" }}>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};
