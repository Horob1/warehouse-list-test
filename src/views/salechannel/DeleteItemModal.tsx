import { Box, Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "./../../api/axios_mdm";
import { useState } from "react";
import toast from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const DeleteItemModal = ({
  onClose,
  refetchData,
  ids,
}: DeleteItemModalProps) => {
  const [enable, setEnable] = useState(false);
  const handleDeleteSaleChannel = async () => {
    setEnable(false);
    try {
      const response = await axios.post("/v1/TblDmSaleChanel/delete", ids);
      if (response?.data?.success) {
        toast.success("Xóa thành công!");
        await refetchData();
        onClose((prev: any) => !prev);
        modals.closeAll();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      console.log(error);
    } finally {
      setEnable(true);
    }
  };
  return (
    <Box size={"auto"}>
      <Text size="20px" mt={5}>
        {ids.length === 1
          ? "Bạn có chắc chắn muốn xóa kênh bán hàng này ?"
          : "Bạn có chắc chắn muốn xóa các kênh bán hàng này ?"}
      </Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="gray"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
        <Button
          type="button"
          disabled={enable}
          color="red"
          onClick={handleDeleteSaleChannel}
          leftSection={<IconCheck size={18} />}
        >
          Xóa
        </Button>
      </Group>
    </Box>
  );
};

type DeleteItemModalProps = {
  onClose: any;
  refetchData: any;
  ids: string[];
};
