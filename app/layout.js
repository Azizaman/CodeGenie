import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";
import AppSideBar from "@/components/custom/AppSideBar";

export const metadata = {
  title: "CodeGenie",
  description: "AI-Powered Coding Magic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen">
        <ConvexClientProvider>
          <Provider>
            <div className="flex h-full w-full">
              {/* Sidebar stays fixed */}
              <AppSideBar />

              {/* Only this part updates when navigating */}
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

