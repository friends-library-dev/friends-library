import { syntax as graphql, Uuid, PrintJobStatus } from '@friends-library/types';
import { Db } from './types';
import Client from './Client';

export default class Orders {
  public constructor(private client: Client) {}

  public findById(id: Uuid): Promise<[Db.QueryError, null | Db.Order]> {
    return this.client.sendQuery<Db.Order>(FIND_BY_ID, { id });
  }

  public async findByPrintJobStatus(
    status: PrintJobStatus,
  ): Promise<[Db.QueryError, null | Db.Order[]]> {
    const [errors, result] = await this.client.sendQuery<{ orders: Db.Order[] }>(
      ORDERS_BY_PRINT_JOB_STATUS,
      { status },
    );
    return [errors, result ? result.orders : null];
  }

  public async save(order: Db.Order): Promise<[Db.QueryError, boolean]> {
    if (!order.faunaId) throw new Error(`Missing faunadb id`);
    const faunaId = order.faunaId;
    order.updated = new Date().toISOString();
    const [errors] = await this.client.sendQuery(SAVE_ORDER, {
      id: faunaId,
      data: faunaize(order),
    });
    return [errors, !errors];
  }

  public async saveAll(orders: Db.Order[]): Promise<[Db.QueryError, boolean]> {
    const results = await Promise.all(orders.map((o) => this.save(o)));
    let error: Db.QueryError = null;
    let allSucceeded = true;
    results.forEach(([err, result]) => {
      if (err) {
        error = err;
      }
      if (!result) {
        allSucceeded = false;
      }
    });
    return [error, allSucceeded];
  }

  public async create(order: Db.Order): Promise<[Db.QueryError, boolean]> {
    const [errors] = await this.client.sendQuery(CREATE_ORDER, { data: faunaize(order) });
    return [errors, !errors];
  }
}

function faunaize(order: Db.Order): Record<string, any> {
  const data = { ...order, externalId: order.id };
  delete data.id;
  delete data.faunaId;
  return data;
}

const CREATE_ORDER = graphql`
  mutation CreateOrder($data: OrderInput!) {
    result: createOrder(data: $data) {
      externalId
    }
  }
`;

const SAVE_ORDER = graphql`
  mutation SaveOrder($id: ID!, $data: OrderInput!) {
    result: updateOrder(id: $id, data: $data) {
      id: externalId
    }
  }
`;

const ORDERS_BY_PRINT_JOB_STATUS = graphql`
  query findByPrintJobStatus($status: PrintJobStatus!) {
    result: ordersByPrintJobStatus(printJobStatus: $status) {
      orders: data {
        faunaId: _id
        id: externalId
        email
        lang
        created
        updated
        amount
        taxes
        shipping
        ccFeeOffset
        paymentId
        items {
          title
          documentId
          edition
          quantity
          unitPrice
        }
        printJobId
        printJobStatus
        shippingLevel
        address {
          name
          street
          street2
          city
          state
          zip
          country
        }
      }
    }
  }
`;

const FIND_BY_ID = graphql`
  query orderById($id: String!) {
    result: findOrderByExternalId(externalId: $id) {
      faunaId: _id
      id: externalId
      email
      lang
      created
      updated
      amount
      taxes
      shipping
      ccFeeOffset
      paymentId
      items {
        title
        documentId
        edition
        quantity
        unitPrice
      }
      printJobId
      printJobStatus
      shippingLevel
      address {
        name
        street
        street2
        city
        state
        zip
        country
      }
    }
  }
`;
