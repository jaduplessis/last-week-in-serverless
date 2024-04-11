import { Entity, EntityItem } from 'dynamodb-toolbox';
import { DataSourcesTable } from './Table';
import { ulid } from 'ulid';

export const BenchmarkEntity = new Entity({
  name: 'BenchmarkDataSource',
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: 'BENCHMARK#' },
    SK: { sortKey: true, hidden: true, default: 'ROOT' },
    id: ['PK', 0, { type: 'string', required: true, default: () => ulid() }],
    title: { type: 'string', required: true },
    link: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    embedding: { type: 'list', required: true },
  },
  table: DataSourcesTable,
} as const);

export type IInvocation = EntityItem<typeof BenchmarkEntity>;
