import { FooterNav } from "@/components/ui/footer-nav";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <FooterNav />
        </>
    );
}
