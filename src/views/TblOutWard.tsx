export interface TblOutwardGetList {
  createBy: number | null;
  createDate: string | null;
  createName: string | null;
  departmentId: number | null;
  description: string | null;
  inventoryId: number | null;
  lastUpdateBy: number | null;
  lastUpdateDate: string | null;
  sourceCode: string | null;
  sourceType: string | null;
  status: string | null;
  subInvId: number | null;
  subInvName: string | null;
  transactionCode: string | null;
  transactionDate: string | null;
  transactionId: number;
  type: number | null;
}

export interface ITblOutwardSearchInput {
  key: string;
}
