import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Title,
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
import { modals } from "@mantine/modals";
import { CreateNewItemModal } from "./CreateNewItemModal";
import { EditItemModal } from "./EditItemModal";
import toast, { Toaster } from "react-hot-toast";
import { DeleteItemModal } from "./DeleteItemModal";

export const SaleChanel = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [data, setData] = useState<TblDMSaleChannel[]>([]);
  const [pagination, setPagination] = useState(paginationBase);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available
  const [height, setHeight] = useState(0);
  const [deleteViewModelStatus, setDeleteViewModelStatus] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectIds, setSelectIds] = useState<string[]>([]);

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
              <ActionIcon
                onClick={async () => {
                  editItem(row.original.id);
                }}
                variant="light"
                aria-label="Settings"
                color="orange"
              >
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
                onClick={async () => {
                  await toggleItemStatus(
                    row.original.id,
                    row.original.active === true
                  );
                }}
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
              <ActionIcon
                onClick={() => {
                  deleteItems([], row.original.id);
                }}
                variant="light"
                aria-label="Settings"
                color="red"
              >
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Box>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useMantineReactTable({
    data,
    columns,
    rowCount,
    columnFilterDisplayMode: "popover",
    mantineTableContainerProps: {
      style: {
        maxHeight: height,
        minHeight: height,
      },
    },
    // enableTopToolbar: false,
    getRowId: (row) => row.id,
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
        <Button
          onClick={createNewItem}
          leftSection={<IoMdAdd />}
          variant="outline"
        >
          Thêm mới
        </Button>
        <Button
          onClick={() => {
            deleteItems(selectIds);
          }}
          leftSection={<RiDeleteBinLine />}
          disabled={selectIds.length === 0}
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
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      showSkeletons: isLoading,
    },
  });

  async function toggleItemStatus(id: string, status: boolean) {
    try {
      const response = await axios.post(
        `/v1/TblDmSaleChanel/update-active?status=${!status}`,
        [id]
      );
      if (response?.data?.success) {
        toast.success("Cập nhật trạng thái thành công!");
        await fetchData();
      } else toast.error("Cập nhật trạng thái thất bại!");
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
      console.error(error);
    }
  }

  function deleteItems(ids: string[], id?: string) {
    // Ensure the correct ids are passed, fall back to `ids` if `id` is undefined
    const validIds = id ? [id] : ids;

    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa kênh bán hàng!</Title>
        </>
      ),
      children: (
        <DeleteItemModal
          onClose={setDeleteViewModelStatus}
          ids={validIds}
          refetchData={fetchData}
        />
      ),
      size: "auto",
      cancelProps: { display: "none" },
      confirmProps: {
        display: "none",
      },
    });
  }

  function createNewItem() {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Thêm kênh bán hàng!</Title>
        </>
      ),
      children: <CreateNewItemModal onClose={setDeleteViewModelStatus} />,
      size: "auto",
      cancelProps: { display: "none" },
      confirmProps: {
        display: "none",
      },
    });
  }
  function editItem(id: string | number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa kênh bán hàng !</Title>
        </>
      ),
      size: "auto",
      children: <EditItemModal id={id} onClose={setDeleteViewModelStatus} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

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
        setSelectIds([]);
        table.resetRowSelection();
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
  }, [pagination.pageIndex, pagination.pageSize, deleteViewModelStatus]);

  useEffect(() => {
    const valueList = Object.keys(rowSelection);
    if (valueList.length > 0) setSelectIds(valueList);
    else setSelectIds([]);
  }, [rowSelection]);

  useEffect(() => {
    console.log("Rerender");
  });
  return (
    <Container fluid>
      <BreadcrumbLayout />
      <MantineReactTable table={table} />
      <Toaster position="top-right" reverseOrder={false} />
    </Container>
  );
};
