"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { APP_NAME } from "@/helpers/constants";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});


export default function Home() {

  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 text-3xl text-center md:text-5xl">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-y-6 text-center"
        >
          {/* Logo Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-2"
          >
            Logo
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={cn("text-black", poppins.className)}
          >
            Welcome to <span className="bg-gradient-to-r from-green-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent text-5xl font-bold">
              {APP_NAME}
            </span>

          </motion.h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-black tracking-widest font-thin max-w-md">
            Experience <span className="font-bold">AI-powered</span> mental health analysis and insights.
          </p>
          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className={cn("text-lg text-black tracking-wide", poppins.className)}>Join {APP_NAME} today and start your journey!</p>
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                <Button className={cn("mt-4 px-8 py-5 text-base text-white border-[1px] border-black rounded-2xl bg-black hover:text-black hover:bg-transparent cursor-pointer", poppins.className)}>
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </BackgroundGradientAnimation>
  );
}
