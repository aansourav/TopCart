import { auth } from "@/auth";
import {
    getAllCartEntries,
    getAllCategories,
    getAllWishlistEntries,
} from "@/db/queries";
import { dbConnect } from "@/server";
import type { Metadata } from "next";
import { Session } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Footer from "../componenets/footer/Footer";
import FooterBottom from "../componenets/footer/FooterBottom";
import Header from "../componenets/header/Header";
import Navbar from "../componenets/header/Navbar";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
interface RootLayoutProps {
    children: React.ReactNode;
    params: {
        locale: string;
    };
}
export const metadata: Metadata = {
    title: "LWSKart",
    description:
        "Shop the latest fashion & shoes online. Free delivery on orders over $50. Shop now!",
};

export default async function RootLayout({
    children,
    params: { locale },
}: Readonly<RootLayoutProps>) {
    await dbConnect();
    const session: Session | null | undefined = await auth();

    const carts = await getAllCartEntries(session?.user?.id as string);
    await dbConnect();
    const wishlist = await getAllWishlistEntries(session?.user?.id as string);

    const messages = await getMessages();

    const categories = await getAllCategories();
    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <body className={inter.className}>
                    <Header carts={carts} wishlist={wishlist}></Header>
                    <Navbar session={session} categories={categories}></Navbar>
                    {children}
                    <Toaster richColors position="top-center" />
                    <Footer></Footer>
                    <FooterBottom></FooterBottom>
                </body>
            </NextIntlClientProvider>
        </html>
    );
}
