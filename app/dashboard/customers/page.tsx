import { Metadata } from "next";
import CustomersTable from "@/app/ui/customers/table";
import { fetchCustomers, fetchFilteredCustomers } from "@/app/lib/data";
import { FormattedCustomersTable } from "@/app/lib/definitions";
import React, { Suspense } from "react";
import { TableRowSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const customersList = await fetchCustomers();
  const filteredCustomers = customersList.map(async (customer) => {
    return await fetchFilteredCustomers(customer.name);
  });
  const filteredCustomersData = await Promise.all(filteredCustomers);
  let customers: FormattedCustomersTable[];
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  if (!query || query === "") {
    customers = filteredCustomersData.map((customer) => {
      return customer[0];
    });
  } else {
    customers = await fetchFilteredCustomers(query);
  }
  return <CustomersTable customers={customers} query={query} />;
}
