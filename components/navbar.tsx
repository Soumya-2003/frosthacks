"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { DarkModeToggle } from "./darkModeToggler";
import { useSession } from "next-auth/react";
import { UserAvatar } from "./userAvatar";
import { MessageCircle } from "lucide-react";
import ChatbotPage from "./chatbotTool";

const poppins = Poppins({
    weight: "600",
    subsets: ["latin"]
})


export const Navbar = ({ className }: { className?: string }) => {
    const [active, setActive] = useState<string | null>(null);
    const { data: session, status } = useSession();

    console.log("User Status: ",status)
    return (
        <div
            className={cn("fixed top-10 inset-x-0 max-w-4xl mx-auto z-50 flex justify-center items-center", className)}
        >
            <Menu setActive={setActive}>

                <Link
                    href={"/dashboard"}
                >
                    <h2
                        className={cn("font-bold", poppins.className)}
                    >
                        Moodify
                    </h2>
                </Link>

                <MenuItem setActive={setActive} active={active} item="Assessments">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/assessment/questionarries">Questionnaires</HoveredLink>
                        <HoveredLink href="/assessment/imageperception">Cognitive Image Perception</HoveredLink>
                        <HoveredLink href="/assessment/sentenceformation">Cognitive Sentence Formation</HoveredLink>
                    </div>
                </MenuItem>

                {/* <MenuItem setActive={setActive} active={active} item="Resources">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/blog">Mental Health Blog</HoveredLink>
                        <HoveredLink href="/tips">Wellness Tips</HoveredLink>
                    </div>
                </MenuItem> */}

                <MenuItem setActive={setActive} active={active} item="Account">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/profile">My Profile</HoveredLink>
                        <HoveredLink href="/reports">Reports</HoveredLink>
                        <HoveredLink href="/settings">Settings</HoveredLink>
                    </div>
                </MenuItem>

                <MenuItem setActive={setActive} active={active} item="Premium">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/pricing">Pricing</HoveredLink>
                        <HoveredLink href="/subscribe">Subscribe</HoveredLink>
                    </div>
                </MenuItem>

                <MenuItem setActive={setActive} active={active} item="Support">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/help">FAQs</HoveredLink>
                        <HoveredLink href="/feedback">Feedback</HoveredLink>
                        <HoveredLink href="/contact">Contact Support</HoveredLink>
                    </div>
                </MenuItem>

                <UserAvatar profilePicture={session?.user?.image|| ""}/>

                <ChatbotPage />

                
                <DarkModeToggle />
            </Menu>

        </div>
    );
}
