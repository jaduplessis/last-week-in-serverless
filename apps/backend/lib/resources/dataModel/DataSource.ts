import { Entity, EntityItem } from "dynamodb-toolbox";
import { DataSourcesTable } from "./Table";

export const DataSourceEntity = new Entity({
  name: "DataSource",
  attributes: {
    PK: { partitionKey: true, prefix: "DATA_SOURCE#" },
    SK: { sortKey: true, prefix: "TITLE#" },
    source: ["PK", 0, { type: "string", required: true }],
    title: ["SK", 0, { type: "string", required: true }],
    link: { type: "string", required: true },
    content: { type: "string" },
    summary: { type: "string", required: true },
    embedding: { type: "list", required: true },
  },
  table: DataSourcesTable,
} as const);

export type IInvocation = EntityItem<typeof DataSourceEntity>;
