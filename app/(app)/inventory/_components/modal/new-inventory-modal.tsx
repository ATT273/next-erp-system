"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { ForwardedRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useInventoryStore } from "../../_store/inventory-store";
import { permissionsValue } from "@/constants";
import NewInventoryForm from "../form/new-inventory-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formInfoSchema } from "../../_types/inventory.schema";
import useGetProducts from "../../../product/_hooks/use-get-products";
import { INewInventoryForm, IResponseInventoryDetail } from "@/types/inventory.type";
import { INVENTORY_QUERY_KEY } from "../../_hooks/useGetInventories";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateInventory } from "../../_hooks/useUpdateInventory";
import { useAddInventory } from "../../_hooks/useAddInventory";

interface NewInventoryDialogProps {
  ref?: ForwardedRef<InventoryDialogRef>;
}

export interface InventoryDialogRef {
  handleOpen: () => void;
  handleClose: () => void;
}

const NewInventory = ({ ref }: NewInventoryDialogProps) => {
  const queryClient = useQueryClient();
  const { setSelectedId, setInventoryDetails, selectedInventoryId, inventoryDetails } = useInventoryStore();
  const [permissions, setPermissions] = useState({ access: false, edit: false, delete: false });
  const { toast } = useToast();
  const { productsData, getProductsData } = useGetProducts();
  const state = useOverlayState();
  const { updateInventory, isUpdating } = useUpdateInventory();
  const { addInventory, isAdding } = useAddInventory();
  const formInfo = useForm<z.infer<typeof formInfoSchema>>({
    resolver: zodResolver(formInfoSchema),
    defaultValues: { skuId: "", qtyChange: 0, note: "", changeType: "SALES" },
    mode: "onSubmit",
  });

  const handleAddNewInventory = async (data: INewInventoryForm) => {
    try {
      const result = await addInventory({ data });
      if (result.status === 200) {
        toast.success({ title: "Success", message: "Inventory created successfully" });
        queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY], exact: false, refetchType: "active" });
        formInfo.reset();
        state.close();
      } else {
        toast.error({ title: "Failed", message: `Failed to create inventory: ${result.message}` });
      }
    } catch (error) {
      toast.error({ title: "Error", message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  };

  const handleUpdateInventory = async (id: string, data: INewInventoryForm) => {
    try {
      const result = await updateInventory({ id, data });
      if (result.status === 200) {
        toast.success({ title: "Success", message: "Inventory updated successfully" });
        formInfo.reset();
        queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY], exact: false, refetchType: "active" });
        setInventoryDetails({} as IResponseInventoryDetail);
        state.close();
      } else {
        toast.error({ title: "Failed", message: `Failed to update inventory: ${result.message}` });
      }
    } catch (error) {
      toast.error({ title: "Error", message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  };

  const onSubmit = async () => {
    const data = { ...formInfo.getValues() };
    if (inventoryDetails && inventoryDetails.id) {
      await handleUpdateInventory(inventoryDetails.id, data);
    } else {
      await handleAddNewInventory(data);
    }
  };

  useImperativeHandle(ref, () => ({ handleClose: () => state.close(), handleOpen: () => state.open() }), []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      setPermissions({
        access: !!(user.permissions & permissionsValue.ACCESS),
        edit: !!(user.permissions & permissionsValue.EDIT),
        delete: !!(user.permissions & permissionsValue.DELETE),
      });
    }
    getProductsData({ page: 1, limit: 100 });
  }, []);

  useEffect(() => {
    if (inventoryDetails && inventoryDetails.id) {
      formInfo.reset({ skuId: inventoryDetails.skuId, qtyChange: inventoryDetails.qtyChange, note: inventoryDetails.note, changeType: inventoryDetails.changeType });
    }
  }, [inventoryDetails]);

  return (
    <div>
      <Modal state={state}>
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>
                  {inventoryDetails && inventoryDetails.id ? "Edit inventory" : "Create new inventory"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <FormProvider {...formInfo}>
                  <form
                    key="new-inventory-form"
                    id="new-inventory-form"
                    onSubmit={formInfo.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3 items-center overflow-y-auto"
                  >
                    <NewInventoryForm products={productsData} />
                  </form>
                </FormProvider>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={() => state.close()}>Cancel</Button>
                <Button
                  type="submit"
                  form="new-inventory-form"
                  className="bg-emerald-500"
                  disabled={isUpdating || isAdding}
                >
                  {inventoryDetails && inventoryDetails.id ? "Update" : "Save"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      {!ref && (
        <Button onPress={() => state.open()} disabled={!permissions.edit}>
          Add inventory change
        </Button>
      )}
    </div>
  );
};

export default NewInventory;
