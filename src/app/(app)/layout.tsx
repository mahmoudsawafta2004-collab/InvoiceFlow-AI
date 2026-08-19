import { AppNav } from "@/components/app-nav";

/**
 * Shell for the working surface. The marketing page sits outside this group so
 * it can commit to its own dark treatment.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppNav />
      <main className="flex-1">{children}</main>
    </>
  );
}
