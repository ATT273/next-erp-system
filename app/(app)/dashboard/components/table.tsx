"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./dashboard-provider";
import { getInventories, getInventoryByType } from "../actions";
import { InventoryItem } from "@/types/inventory.type";
import { CHANGE_TYPE_LABELS } from "@/constants/dashboard.constants";
import { ChipColor } from "@/types/heroui.types";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Pagination } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { IBaseOptionParams, IResponseMeta } from "@/types/response.types";
import { DEFAULT_META } from "@/constants/response.constants";
import CustomPagination from "@/components/ui/Pagination";

const columns = [
  {
    id: "id",
    label: "ID",
    className: "w-[220px]",
  },
  {
    id: "productName",
    label: "PRODUCT NAME",
    className: "",
  },
  {
    id: "sku",
    label: "SKU",
    className: "w-[100px]",
  },
  {
    id: "type",
    label: "Type",
    className: "w-[100px] text-center",
  },
  {
    id: "quantity",
    label: "QUANTITY",
    className: "w-[150px] text-right",
  },
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
      const formattedMeta = {
        page: data.meta?.page ? Number(data.meta?.page) : DEFAULT_META.page,
        limit: data.meta?.limit ? Number(data.meta?.limit) : DEFAULT_META.limit,
        total: data.meta?.total ? Number(data.meta?.total) : DEFAULT_META.total,
        count: data.meta?.count ? Number(data.meta?.count) : DEFAULT_META.count,
        totalPages: data.meta?.totalPages ? Number(data.meta?.totalPages) : DEFAULT_META.totalPages,
      };

      setMeta(formattedMeta);
    }
  };

  const onPageChange = (value: number) => {
    setMeta((prev) => ({ ...prev, page: value }));
    getInventoriesData({
      page: value,
      limit: meta.limit,
      keyword: "",
    });
  };

  useEffect(() => {
    const params = {
      page: 1,
      limit: 1,
      keyword: "",
    };
    getInventoriesData(params);
  }, [type]);
  console.log("summaries", summaries);
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex-1">
        <Table>
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.id} className={column.className}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {summaries.map((item) => {
              const chipColor =
                CHANGE_TYPE_LABELS[item.changeType as keyof typeof CHANGE_TYPE_LABELS]?.color ?? "default";
              return (
                <TableRow key={item.id}>
                  <TableCell className="w-[220px]">{item.id}</TableCell>
                  <TableCell>
                    <Link
                      isExternal
                      showAnchorIcon
                      href={`product/${item.id}`}
                      className="text-zinc-500 hover:text-sky-500"
                    >
                      {item.productName}
                    </Link>
                  </TableCell>
                  <TableCell className="w-[100px]">{item.skuCode}</TableCell>
                  <TableCell className="w-[100px] text-center">
                    <Chip color={chipColor as ChipColor}>{item.changeType}</Chip>
                  </TableCell>
                  <TableCell className="w-[150px] text-right">{item.qtyChange}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
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
