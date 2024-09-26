import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { TblDMSaleChannel } from "./TblDMSaleChanel";
import { hasLength, useForm } from "@mantine/form";
import axios from "./../../api/axios_mdm";
import toast from "react-hot-toast";
import { useDisclosure } from "@mantine/hooks";
import { handleKeyDown } from "../../utils/handleKeyDownEvent";
import { modals } from "@mantine/modals";
import { IconCheck, IconWindow } from "@tabler/icons-react";
import { sky_blue } from "../../const/color";
import { useEffect, useState } from "react";

export const EditItemModal = ({ onClose, id }: EditItemModalProps) => {
  const data: TblDMSaleChannel = {
    id: "0",
    code: null,
    name: null,
    active: false,
  };

  const [enable, setEnable] = useState(false);

  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<TblDMSaleChannel>({
    mode: "controlled",
    validateInputOnChange: true,
    initialValues: {
      ...data,
    },

    validate: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code: (value: any | null) => {
        const invalidChars =
          /[âăáàảãạêếềệễểíìịĩỉóòỏõọôốồộổỗơớờợỡởúùủũụưứừựữửýỳỷỹỵđ]/i;
        if (invalidChars.test(value)) {
          return "Mã kênh bán hàng chứa những kí tự không hợp lệ !";
        }
        if (!value) {
          return "Vui lòng nhập tên kênh bán hàng !";
        }
        return hasLength(
          { max: 30 },
          "Tên kênh bán hàng không được dài hơn 30 ký tự !"
        )(value as string);
      },
      name: (value: string | null) => {
        if (!value) {
          return "Vui lòng nhập tên kênh bán hàng !";
        }
        return hasLength(
          { max: 225, min: 5 },
          "Tên kênh bán hàng không được dài hơn 10 ký tự !"
        )(value as string);
      },
    },
  });

  const handleEditTblDMSaleChannel = async (dataSubmit: TblDMSaleChannel) => {
    open();
    try {
      const response = await axios.post(
        "/v1/TblDMSaleChanel/update",
        dataSubmit
      );
      const result = response?.data;
      if (result?.success) {
        console.log("Success");
        toast.success(result.message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClose((prev: any) => !prev);
        modals.closeAll();
      } else toast.error("Có lỗi xảy ra!");
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      console.error(error);
    }
  };
  const callApiGetData = async () => {
    open();
    try {
      const response = await axios.get(`/v1/TblDMSaleChanel/update?id=${id}`);
      const result = response?.data;

      if (result?.success) {
        const dataApi = result?.data;
        if (dataApi != null) {
          form.setValues(dataApi);
          form.resetDirty(dataApi);
        }
        close();
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if (id) {
      callApiGetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (form.isDirty()) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [form]);

  return (
    <Box
      component="form"
      mx="auto"
      w={{ base: "250px", md: "300px", lg: "400px" }}
      onSubmit={form.onSubmit((e: TblDMSaleChannel) => {
        handleEditTblDMSaleChannel(e);
      })}
      style={{ position: "relative" }}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Grid mt={10}>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <TextInput
            label={"Mã"}
            placeholder={"Nhập mã"}
            type="text"
            onKeyDown={handleKeyDown}
            withAsterisk
            {...form.getInputProps("code")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
          <TextInput
            label={"Tên"}
            placeholder={"Nhập tên"}
            type="text"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
      </Grid>

      <Checkbox
        label={"Sử dụng"}
        checked={form.values.active}
        {...form.getInputProps("active")}
        mt={10}
      />

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
          disabled={!enable}
          loading={visible}
          leftSection={!visible ? <IconCheck size={18} /> : undefined}
        >
          Lưu
        </Button>
      </Group>
    </Box>
  );
};
type EditItemModalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any;
  id: string | number;
};
