"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { ForwardedRef, useEffect, useImperativeHandle, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useInventoryStore } from "../../_store/inventory-store";
import { canEdit } from "@/utils/rbac.utils";
import { useAuth } from "@/app/(app)/_providers/authProvider";
import NewInventoryForm from "../form/new-inventory-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formInventorySchema } from "../../_types/inventory.schema";
import useGetProducts from "../../../product/_hooks/use-get-products";
import { type IInventoryFormValues } from "../../_types/inventory.schema";
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
  const { authSession } = useAuth();
  const _canEdit = useMemo(() => {
    if (!authSession?.permissions) return false;
    return canEdit(authSession.permissions, "inventory");
  }, [authSession?.permissions]);
  const { toast } = useToast();
  const { productsData, getProductsData } = useGetProducts();
  const state = useOverlayState();
  const { updateInventory, isUpdating } = useUpdateInventory();
  const { addInventory, isAdding } = useAddInventory();
  const formInfo = useForm<z.infer<typeof formInventorySchema>>({
    resolver: zodResolver(formInventorySchema),
    defaultValues: { skuId: "", qtyChange: 0, note: "", changeType: "SALES" },
    mode: "onSubmit",
  });
  console.log("productData inventory", productsData);
  const handleAddNewInventory = async (data: IInventoryFormValues) => {
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

  const handleUpdateInventory = async (id: string, data: IInventoryFormValues) => {
    try {
      const result = await updateInventory({ id, data });
      if (result.status === 200) {
        toast.success({ title: "Success", message: "Inventory updated successfully" });
        formInfo.reset();
        queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY], exact: false, refetchType: "active" });
        setInventoryDetails(null);
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
    getProductsData({ page: 1, limit: 100 });
  }, []);

  useEffect(() => {
    if (inventoryDetails && inventoryDetails.id) {
      formInfo.reset({
        skuId: inventoryDetails.skuId,
        qtyChange: inventoryDetails.qtyChange,
        note: inventoryDetails.note ?? undefined,
        changeType: inventoryDetails.changeType,
      });
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
                    className="flex flex-col items-center gap-3 overflow-y-auto"
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
                  isDisabled={isUpdating || isAdding}
                >
                  {inventoryDetails && inventoryDetails.id ? "Update" : "Save"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      {!ref && (
        <Button onPress={() => state.open()} isDisabled={!_canEdit}>
          Add inventory change
        </Button>
      )}
    </div>
  );
};

export default NewInventory;
