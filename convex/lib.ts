import type { TableName } from "../packages/db/src/table-names";

type StripUndefinedFields<T extends object> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
};

export function nowISOString(): string {
  return new Date().toISOString();
}

export function nowMillis(): number {
  return Date.now();
}

export function buildTimestampedInsert<T extends object>(row: T): StripUndefinedFields<T> & {
  createdAt: number;
  updatedAt: number;
} {
  const timestamp = nowMillis();
  return {
    ...stripUndefined(row),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateTimestampedRow<T extends { updatedAt: number }>(row: T): T {
  return {
    ...row,
    updatedAt: nowMillis(),
  };
}

export function asTableName(value: TableName): TableName {
  return value;
}

export function stripUndefined<T extends object>(row: T): StripUndefinedFields<T> {
  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined),
  ) as StripUndefinedFields<T>;
}
