export type BarScore = {
  areaName: string;
  percentage: number;
};

export type TableScore = {
  brand_id: string;
  brand_name: string;
  compliance: {
    area_id: string;
    area_name: string;
    percentage: number;
  }[];
};

export type AppendReportBar = {
  report_id: string;
  store_id: string;
  product_id: string;
  area_id?: string;
  compliance: string;
  tanggal: string;
};

export type AppendReportTable = {
  report_id: string;
  store_id: string;
  product_id: string;
  brand_id?: string;
  brand_name?: string;
  area_id?: string;
  compliance: string;
  tanggal: string;
};

export type Area = {
  area_id: string;
  area_name: string;
};
