import {
  areaData,
  reportData,
  storeData,
  productData,
  brandData,
} from "../data";
import type {
  AppendReportBar,
  BarScore,
  AppendReportTable,
  TableScore,
  Area,
} from "../types";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const getAreas = async (): Promise<Area[]> => {
  return Promise.resolve(areaData);
};

export const getBarScore = async (
  areas?: string[],
  from?: string,
  to?: string
): Promise<BarScore[]> => {
  let allowedStore = storeData;

  if (areas && areas.length) {
    allowedStore = allowedStore.filter((store) =>
      areas.includes(store.area_id)
    );
  }

  const allowedStoreIds = allowedStore.map((store) => {
    return store.store_id;
  });

  let filteredArea = areaData;

  if (areas && areas.length) {
    filteredArea = filteredArea.filter((area) => areas.includes(area.area_id));
  }

  let filteredReport = reportData;

  if (areas && areas.length) {
    filteredReport = filteredReport.filter((report) =>
      allowedStoreIds.includes(report.store_id)
    );
  }

  if (from) {
    filteredReport = filteredReport.filter((report) =>
      dayjs(report.tanggal, "YYYY-MM-DD").isSameOrAfter(dayjs(from))
    );
  }

  if (to) {
    filteredReport = filteredReport.filter((report) =>
      dayjs(report.tanggal, "YYYY-MM-DD").isSameOrBefore(dayjs(to))
    );
  }

  const appendedReport = filteredReport as AppendReportBar[];

  appendedReport.forEach((report) => {
    const areaId = allowedStore.find(
      (store) => store.store_id === report.store_id
    )?.area_id;

    report.area_id = areaId;
  });

  const result = filteredArea.map((area) => {
    const reportByArea = appendedReport.filter(
      (report) => report.area_id === area.area_id
    );

    const compliedReport = reportByArea.filter(
      (report) => report.compliance === "1"
    );

    return {
      areaId: area.area_id,
      areaName: area.area_name,
      percentage: Math.round(
        (compliedReport.length / reportByArea.length) * 100
      ),
    };
  });

  return Promise.resolve(result);
};

export const getTableScore = async (
  areas?: string[],
  from?: string,
  to?: string
): Promise<TableScore[]> => {
  let allowedStore = storeData;

  if (areas && areas.length) {
    allowedStore = allowedStore.filter((store) =>
      areas.includes(store.area_id)
    );
  }

  const allowedStoreIds = allowedStore.map((store) => {
    return store.store_id;
  });

  let filteredArea = areaData;

  if (areas && areas.length) {
    filteredArea = filteredArea.filter((area) => areas.includes(area.area_id));
  }

  let filteredReport = reportData;

  if (areas && areas.length) {
    filteredReport = filteredReport.filter(
      (report) => allowedStoreIds.includes(report.store_id) && report.tanggal
    );
  }

  if (from) {
    filteredReport = filteredReport.filter((report) =>
      dayjs(report.tanggal, "YYYY-MM-DD").isSameOrAfter(
        dayjs(from, "YYYY-MM-DD")
      )
    );
  }

  if (to) {
    filteredReport = filteredReport.filter((report) =>
      dayjs(report.tanggal, "YYYY-MM-DD").isSameOrBefore(
        dayjs(to, "YYYY-MM-DD")
      )
    );
  }

  const appendedReport = filteredReport as AppendReportTable[];

  appendedReport.forEach((report) => {
    const areaId = allowedStore.find(
      (store) => store.store_id === report.store_id
    )?.area_id;

    const product = productData.find(
      (product) => product.product_id === report.product_id
    );
    const brand = brandData.find(
      (brand) => brand.brand_id === product?.brand_id
    );

    report.brand_id = brand?.brand_id;
    report.brand_name = brand?.brand_name;
    report.area_id = areaId;
  });

  const result = brandData.map((brand) => {
    const filteredReportByBrand = appendedReport.filter(
      (report) => report.brand_id === brand.brand_id
    );

    const areasCompliance = filteredArea.map((area) => {
      const reportInArea = filteredReportByBrand.filter(
        (report) => report.area_id === area.area_id
      );
      const compliedReportInArea = reportInArea.filter(
        (report) => report.compliance === "1"
      );
      return {
        area_id: area.area_id,
        area_name: area.area_name,
        percentage: Math.round(
          (compliedReportInArea.length / reportInArea.length) * 100
        ),
      };
    });

    return {
      brand_id: brand.brand_id,
      brand_name: brand.brand_name,
      compliance: areasCompliance,
    };
  });

  return Promise.resolve(result);
};
