import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { strategies } from '@/app/lib/utils';
 
export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page(props: { params: Promise<{ strategy: string }> }) {
  const params = await props.params;
  const strategy = params.strategy;
//   const [invoice, customers] = await Promise.all([
//     fetchInvoiceById(id),
//     fetchCustomers(),
//   ]);

//   if (!invoice) {
//     notFound();
//   }
// const link = `/dashboard/strategies/${strategies.find(link => link.name === strategy)?.href || ''}`;

//   if (!strategies.some(strat => strat.name === strategy)) {
//     notFound();
//   }

  const formattedStrategy = strategies.find(
    (strat) => strat.href === strategy,
  )?.name || strategy;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Strategies', href: '/dashboard/strategies' },
          {
            label: formattedStrategy,
            href: `/dashboard/strategies/${strategy}/`,
            active: true,
          },
        ]}
      />
      {/* <Form invoice={invoice} customers={customers} /> */}
    </main>
  );
}