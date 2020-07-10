import { ShippingLevel } from '@friends-library/types';

export namespace LuluAPI {
  export interface ShippingAddress {
    name: string;
    street1: string;
    street2?: string;
    country_code: string;
    city: string;
    state_code: string;
    postcode: string;
  }

  export interface CreatePrintJobPayload {
    shipping_level: ShippingLevel;
    shipping_address: ShippingAddress;
    contact_email: string;
    external_id?: string;
    line_items: {
      title: string;
      cover: string;
      interior: string;
      pod_package_id: string;
      quantity: number;
    }[];
  }

  export interface PrintJobCostsPayload {
    shipping_option: ShippingLevel;
    shipping_address: ShippingAddress;
    line_items: {
      page_count: number;
      quantity: number;
      pod_package_id: string;
    }[];
  }

  export interface ShippingCost {
    total_cost_excl_tax: string;
    total_cost_incl_tax: string;
    tax_rate: string;
    total_tax: string;
  }

  export interface PrintJobCostsResponse {
    currency: `USD`;
    total_cost_excl_tax: string;
    total_cost_incl_tax: string;
    total_discount_amount: string;
    total_tax: string;
    shipping_cost: ShippingCost;
    line_item_costs: {
      cost_excl_discounts: string;
      total_tax: string;
      tax_rate: string;
      quantity: number;
      discounts: unknown[];
      total_cost_excl_discounts: string;
      total_cost_excl_tax: string;
      total_cost_incl_tax: string;
      unit_tier_cost: unknown;
    }[];
  }

  export type PrintJobStatus =
    | `CREATED`
    | `REJECTED`
    | `UNPAID`
    | `PAYMENT_IN_PROGRESS`
    | `PRODUCTION_READY`
    | `PRODUCTION_DELAYED`
    | `IN_PRODUCTION`
    | `ERROR`
    | `SHIPPED`
    | `CANCELED`;

  export interface PrintJobStatusResponse {
    name: PrintJobStatus;
    message: string;
    changed: string;
    line_item_statuses: {
      name: string;
      messages: { info: string }[];
      line_item_id: number;
    }[];
    print_job_id: number;
  }

  export interface PrintJobLineItem {
    id: number;
    title: string;
    printable_normalization: {
      interior: {
        source_file: null | unknown;
        normalized_file: null | unknown;
        source_url: string;
        source_md5sum: null | unknown;
        job_id: null | unknown;
        page_count: null | unknown;
      };
      cover: {
        source_file: null | unknown;
        normalized_file: null | unknown;
        source_url: string;
        source_md5sum: null | unknown;
        job_id: null | unknown;
        page_count: null | unknown;
      };
      pod_package_id: string;
    };
    status: {
      name: string;
      messages: { info: string };
    };
    external_id: null | string;
    quantity: number;
    printable_id: null | string;
    order_line_item_id: unknown;
    tracking_id: unknown;
    tracking_urls: null | string[];
    pod_package_id: string;
  }

  export interface ListPrintJobsResponse {
    count: number;
    next: null | unknown;
    previous: null | unknown;
    results: PrintJob[];
  }

  export interface PrintJob {
    id: number;
    line_items: PrintJobLineItem[];
    shipping_level: ShippingLevel;
    shipping_option_id: string;
    status: {
      name: PrintJobStatus;
      message: string;
      changed: string;
    };
    costs: {
      shipping_cost: null | ShippingCost;
      line_item_costs:
        | null
        | {
            line_item_id: number;
            line_item_external_id: null | string;
            cost_excl_discounts: string;
            total_tax: string;
            tax_rate: string;
            quantity: number;
            total_cost_excl_tax: string;
            total_cost_excl_discounts: string;
            total_cost_incl_tax: string;
            discounts: unknown[];
            unit_tier_cost: null | unknown;
          }[];
      total_cost_excl_tax: null | string;
      total_tax: null | string;
      total_cost_incl_tax: null | string;
      currency: null | string;
    };
    parent_job_id: null | string;
    child_job_ids: unknown[];
    estimated_shipping_dates: null | unknown;
    date_created: string;
    date_modified: string;
    external_id: null | string;
    order_id: null | string;
    dropship_profile_id: string;
    contact_email: string;
    production_delay: number;
    production_due_time: null | unknown;
    tax_country: null | string;
    shipping_address: {
      user_id: string;
      organization: unknown;
      street1: string;
      street2: null | string;
      city: string;
      postcode: string;
      phone_number: string;
      email: string;
      is_business: boolean;
      name: string;
      state_code: string;
      country_code: string;
    };
    shipping_option_level: ShippingLevel;
  }
}
