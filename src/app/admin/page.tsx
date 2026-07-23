import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminPage } from "@/components/admin/admin-page";

export const metadata = { title: "管理后台 - AI 抽奖" };

export default async function AdminRoute() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.isAdmin) redirect("/lottery");

  return <AdminPage adminName={session.name} />;
}
