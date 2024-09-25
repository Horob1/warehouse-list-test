import "./warehouseInward.scss";
import {
  Badge,
  Button,
  ComboboxItem,
  Grid,
  Input,
  Select,
  Text,
  // Tooltip,
} from "@mantine/core";
import BreadcrumbLayout from "../../components/breadcrumb/_breadcrumb";
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
import axios from "../../api/axios_pos";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { DatePickerInput } from "@mantine/dates";
import { paginationBase } from "../../utils/pagination";
import { convernDate } from "../../utils/converntDate";
import { ISelectItem } from "./../warehouse/TblSelectItem";

export const WarehouseInward = () => {
  const [data, setData] = useState<TblOutwardGetList[]>([]);
  const [pagination, setPagination] = useState(paginationBase);
  const [search, setSearch] = useState<ITblOutwardSearchInput>({
    key: "",
    source: "",
    empId: "",
    branch: "",
    fromTransationDate: "",
    toTransationDate: "",
  });
  const headerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [dataInventoryTransactionType, setDataInventoryTransactionType] =
    useState<ComboboxItem[]>([]);
  const [dataBranch, setDataBranch] = useState<ComboboxItem[]>([]);
  const [dataEmployee, setDataEmployee] = useState<ComboboxItem[]>([]);

  const handleSearchOnChange = (value: string, key: string) => {
    setSearch((prevState) => ({ ...prevState, [key]: value }));
  };
  const fetchDataInventoryTransactionType = async () => {
    try {
      const response = await axios.get(
        "/v1/TblInventoryTransactionType/get-select"
      );
      const result = response.data;
      if (result.success && result.data) {
        setDataInventoryTransactionType(
          result.data.map((type: ISelectItem) => ({
            value: type.value,
            label: type.text,
          }))
        );
      } else setDataInventoryTransactionType([]);
    } catch (error) {
      console.log(error);
      setDataInventoryTransactionType([]);
    }
  };
  const fetchDataBranch = async () => {
    try {
      const response = await axios.get("/v1/TblDmInventory/get-select-branch");
      const result = response.data;
      if (result.success && result.data) {
        setDataBranch(
          result.data.map((type: ISelectItem) => ({
            value: type.value,
            label: type.text,
          }))
        );
      } else setDataBranch([]);
    } catch (error) {
      console.log(error);
      setDataBranch([]);
    }
  };
  const fetchDataEmployee = async () => {
    try {
      const response = await axios.get("/v1/TblDmEmployee/get-select");
      const result = response.data;
      if (result.success && result.data) {
        setDataEmployee(
          result.data.map((type: ISelectItem) => ({
            value: type.value,
            label: type.text,
          }))
        );
      } else setDataEmployee([]);
    } catch (error) {
      console.log(error);
      setDataEmployee([]);
    }
  };

  const fetchData = async () => {
    let url = `?Skip=${pagination?.pageIndex * pagination?.pageSize}&Take=${
      pagination.pageSize
    }`;
    if (search.key) {
      url += `&KeySearch=${search.key}`;
    }
    if (search.source) {
      url += `&SourceTypeCode=${search.source}`;
    }
    if (search.empId) {
      url += `&EmpId=${search.empId}`;
    }
    if (search.branch) {
      url += `&InvId=${search.branch}`;
    }
    if (search.fromTransationDate) {
      url += `&FromTransationDate=${search.fromTransationDate}`;
    }

    if (search.toTransationDate) {
      url += `&ToTransationDate=${search.toTransationDate}`;
    }
    try {
      const response = await axios.get("/v1/Inward/get-list" + url);
      const result = response.data;
      setRowCount(result.totalCount);
      setData(result.data || []);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchDataInventoryTransactionType(),
          fetchDataBranch(),
          fetchDataEmployee(),
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllData();

    const headerHeight = headerRef.current?.offsetHeight || 0;

    const handleResize = () => {
      setHeight(window.innerHeight - (150 + headerHeight));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("rerender");
  });

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
              onChange={(e) => {
                handleSearchOnChange(e.target.value, "key");
              }}
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
              name={""}
              searchable
              clearable
              leftSection={<IconFileTypography color="#15aabf" />}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
              }}
              nothingFoundMessage={"Không có dữ liệu"}
              data={dataInventoryTransactionType}
              onChange={(value) => {
                handleSearchOnChange(value || "", "source");
              }}
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
              data={dataBranch}
              nothingFoundMessage={"Không có dữ liệu"}
              onChange={(value) => {
                handleSearchOnChange(value || "", "branch");
              }}
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
              data={dataEmployee}
              nothingFoundMessage={"Không có dữ liệu"}
              onChange={(value) => {
                handleSearchOnChange(value || "", "empId");
              }}
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
              onChange={(e) => {
                handleSearchOnChange(
                  e[0] ? e[0].toISOString() : "",
                  "fromTransationDate"
                );

                handleSearchOnChange(
                  e[1] ? e[1].toISOString() : "",
                  "toTransationDate"
                );
              }}
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
