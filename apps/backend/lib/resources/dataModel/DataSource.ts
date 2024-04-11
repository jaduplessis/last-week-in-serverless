import { Entity, EntityItem } from "dynamodb-toolbox";
import { ulid } from "ulid";
import { DataSourcesTable } from "./Table";

export const DataSourceEntity = new Entity({
  name: "DataSource",
  attributes: {
    PK: { partitionKey: true, prefix: "DATA_SOURCE#" },
    SK: { sortKey: true },
    id: ["PK", 0, { type: "string", required: true, default: () => ulid() }],
    title: { type: "string", required: true },
    link: { type: "string", required: true },
    summary: { type: "string", required: true },
    embedding: { type: "list", required: true },
  },
  table: DataSourcesTable,
} as const);

export type IInvocation = EntityItem<typeof DataSourceEntity>;
