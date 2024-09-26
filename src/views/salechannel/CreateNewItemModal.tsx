import { useDisclosure } from "@mantine/hooks";
import { TblDMSaleChannel } from "./TblDMSaleChanel";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import axios from "./../../api/axios_mdm";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { sky_blue } from "../../const/color";
import { handleKeyDown } from "../../utils/handleKeyDownEvent";

export const CreateNewItemModal = ({ onClose }: CreateNewItemModalProps) => {
  const data: TblDMSaleChannel = {
    id: "0",
    code: "",
    name: "",
    active: false,
  };
  const form = useForm<TblDMSaleChannel>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      ...data,
    },

    validate: {
      code: (value: string | null) => {
        const invalidChars =
          /[âăáàảãạêếềệễểíìịĩỉóòỏõọôốồộổỗơớờợỡởúùủũụưứừựữửýỳỷỹỵđ]/i;

        if (!value) {
          return "Vui lòng nhập mã kênh bán hàng !";
        }
        if (invalidChars.test(value ?? "")) {
          return "Mã kênh bán hàng chứa những kí tự không hợp lệ !";
        }
        return hasLength(
          { max: 30 },
          "Mã kênh bán hàng không được dài hơn 30 ký tự !"
        )(value as string);
      },
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên kênh bán hàng !";
        }
        return hasLength(
          { max: 225, min: 5 },
          "Tên kênh bán hàng phải nằm trong khoảng từ 5 đến 225 ký tự !"
        )(value as string);
      },
    },
  });

  const [visible, { close, open }] = useDisclosure(false);
  const handleCreateTblDMSaleChannel = async (dataSubmit: TblDMSaleChannel) => {
    open();
    try {
      const response = await axios.post(
        "/v1/TblDMSaleChanel/create",
        dataSubmit
      );
      const result = response?.data;
      if (result?.success) {
        toast.success(result.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClose((prev: any) => !prev);
        modals.closeAll();
        close();
      } else toast.error("Có lỗi xảy ra!");
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      console.error(error);
    }
  };
  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((e: TblDMSaleChannel) => {
        handleCreateTblDMSaleChannel(e);
      })}
      style={{ position: "relative" }}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <TextInput
            label={"Mã"}
            placeholder={"Nhập mã"}
            type="text"
            onKeyDown={handleKeyDown}
            withAsterisk
            {...form.getInputProps("code")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <TextInput
            label={"Tên"}
            placeholder={"Nhập tên"}
            type="text"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Checkbox
            label={"Sử dụng"}
            {...form.getInputProps("active")}
            mt={27.5}
          />
        </Grid.Col>
      </Grid>

      <Group
        justify="end"
        mt="xs"
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
        }}
      >
        <Button
          type="button"
          color="gray"
          loading={visible}
          onClick={() => {
            modals.closeAll();
          }}
          leftSection={!visible ? <IconWindow size={18} /> : undefined}
        >
          Đóng
        </Button>
        <Button
          type="submit"
          color={sky_blue.base}
          loading={visible}
          leftSection={!visible ? <IconCheck size={18} /> : undefined}
        >
          Lưu
        </Button>
      </Group>
    </Box>
  );
};
type CreateNewItemModalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any;
};
