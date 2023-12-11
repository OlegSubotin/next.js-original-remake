// This file contains type definitions for the application's data models.
// These types describe the structure of the data and the expected data types for each property.
// While we manually define these types for educational purposes, note that tools like Prisma can auto-generate them.
// ORM (Object-Relational Mapping) tools, like Prisma, can automate the process of creating and managing these types.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Seller = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  seller: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};

export type Income = {
  month: string;
  income: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// Omitting the 'amount' property from LatestInvoice and replacing it with a numeric 'amount'.
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  seller_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'awaiting' | 'fulfilled';
};

export type SellersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_awaiting: number;
  total_fulfilled: number;
};

export type FormattedSellersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_awaiting: string;
  total_fulfilled: string;
};

export type SellerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
