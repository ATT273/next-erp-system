"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./dashboard-provider";
import { getInventories } from "../actions";
import { InventoryItem } from "@/types/inventory.type";
import { CHANGE_TYPE_LABELS } from "@/constants/dashboard.constants";
import { ChipColor } from "@/types/heroui.types";
import { Chip, Link, Table } from "@heroui/react";
import { IBaseOptionParams, IResponseMeta } from "@/types/response.types";
import { DEFAULT_META } from "@/constants/response.constants";
import CustomPagination from "@/components/customs/Pagination";

const columns = [
  { id: "id", label: "ID", className: "w-[220px]" },
  { id: "productName", label: "PRODUCT NAME", className: "" },
  { id: "sku", label: "SKU", className: "w-[100px]" },
  { id: "type", label: "Type", className: "w-[100px] text-center" },
  { id: "quantity", label: "QUANTITY", className: "w-[150px] text-right" },
];

const DashboardTable = () => {
  const { type } = useDashboard();
  const [summaries, setSummaries] = useState<InventoryItem[]>([]);
  const [meta, setMeta] = useState<IResponseMeta>(DEFAULT_META);

  const getInventoriesData = async (params: IBaseOptionParams) => {
    const result = type === "TOTAL" ? await getInventories({ ...params }) : await getInventories({ ...params, type });
    const { data } = result;
    if (result.status === 200) {
      setSummaries(data.data);
      setMeta({
        page: Number(data.meta?.page ?? DEFAULT_META.page),
        limit: Number(data.meta?.limit ?? DEFAULT_META.limit),
        total: Number(data.meta?.total ?? DEFAULT_META.total),
        count: Number(data.meta?.count ?? DEFAULT_META.count),
        totalPages: Number(data.meta?.totalPages ?? DEFAULT_META.totalPages),
      });
    }
  };

  const onPageChange = (value: number) => {
    setMeta((prev) => ({ ...prev, page: value }));
    getInventoriesData({ page: value, limit: meta.limit, keyword: "" });
  };

  useEffect(() => {
    getInventoriesData({ page: 1, limit: 1, keyword: "" });
  }, [type]);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex-1">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Inventory list">
              <Table.Header>
                {columns.map((column) => (
                  <Table.Column key={column.id} className={column.className}>
                    {column.label}
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body>
                {summaries.map((item) => {
                  const chipColor =
                    CHANGE_TYPE_LABELS[item.changeType as keyof typeof CHANGE_TYPE_LABELS]?.color ?? "default";
                  return (
                    <Table.Row key={item.id} id={item.id}>
                      <Table.Cell className="w-[220px]">{item.id}</Table.Cell>
                      <Table.Cell>
                        <Link
                          href={`product/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-sky-500"
                        >
                          {item.productName}
                          <Link.Icon />
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="w-[100px]">{item.skuCode}</Table.Cell>
                      <Table.Cell className="w-[100px] text-center">
                        <Chip color={chipColor as ChipColor}>{item.changeType}</Chip>
                      </Table.Cell>
                      <Table.Cell className="w-[150px] text-right">{item.qtyChange}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <CustomPagination
        showControls
        total={meta.totalPages}
        initialPage={meta.page}
        onChange={onPageChange}
        className="flex justify-end"
      />
    </div>
  );
};

export default DashboardTable;
