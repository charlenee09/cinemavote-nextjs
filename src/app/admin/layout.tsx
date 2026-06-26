export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#111] min-h-screen text-white">
      {children}
    </div>
  );
}