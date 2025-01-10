import React from "react";
import Navigation from "@/components/Navigation.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import Footer from "@/components/Footer.tsx";

export default function Default({children}: { children: React.ReactNode }) {
  return (
    <>
      <Navigation/>
      <main className="max-w-screen-lg mt-5 mx-auto px-2 md:px-0">
        {children}
        <Toaster/>
      </main>
      <Footer/>
    </>
  )
}
