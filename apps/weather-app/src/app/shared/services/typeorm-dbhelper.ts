import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DataSource, EntityManager, EntityTarget, InsertQueryBuilder, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class TypeORMDBHelper {
  constructor(private readonly moduleRef: ModuleRef, private dataSource: DataSource) {}

  /**
   * Run the database query execution within the transaction.
   * @param transactionWrap
   * @returns
   */
  runInTransaction<T>(transactionWrap: (entityManager: EntityManager) => Promise<T>, connectionName?: string): Promise<T> {
    const connection: DataSource = this.getDBConnection(connectionName);
    return connection.transaction((entityManager) => {
      return transactionWrap(entityManager);
    });
  }

  /**
   * Execute the query along with provided parameter without the transaction. This should be used only
   * to query the results, for the database update and all use withTransaction.
   * @param queryToExecute
   * @param params
   * @param connectionName
   * @returns
   */
  executeQuery(queryToExecute: string, params?: any[], connectionName?: string): Promise<any> {
    const connection: DataSource = this.getDBConnection(connectionName);
    return connection.query(queryToExecute, params);
  }

  // TODO: Later we have to get the datasource based on the connectionName from the moduleRef
  private getDBConnection(connectionName?: string) {
    return this.dataSource;
  }

  getRepository<T extends ObjectLiteral>(target: EntityTarget<T>): Repository<T> {
    return this.getDBConnection().getRepository<T>(target);
  }

  queryBuilder<Entity>(entityClass: EntityTarget<Entity>, alias: string, connectionName?: string) {
    return this.getDBConnection(connectionName).createQueryBuilder(entityClass, alias);
  }

  insertQueryBuilder(connectionName?: string) {
    return new InsertQueryBuilder(this.getDBConnection(connectionName).createQueryBuilder());
  }
}
