"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/layout/PrivateRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { contactService } from "@/lib/services/contact";
import { Contact } from "@/types";
import { adminMenu } from "@/components/admin/adminMenu";

function AdminContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await contactService.getAll();
        setContacts(response.data || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <DashboardShell title="Admin Contacts" subtitle="Review incoming support requests." menu={adminMenu}>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Contact messages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {contacts.map((contact) => (
                <tr key={contact._id || contact.id}>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{contact.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{contact.subject}</td>
                  <td className="px-6 py-4"><Badge variant={contact.status === "resolved" ? "success" : contact.status === "in-progress" ? "warning" : "info"}>{contact.status}</Badge></td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{contact.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}

export default function AdminContactsPage() {
  return <PrivateRoute roles={["admin"]}><AdminContactsContent /></PrivateRoute>;
}