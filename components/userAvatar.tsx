import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface UserAvatarProps {
    profilePicture: string
}



export const UserAvatar = ({ profilePicture } : UserAvatarProps) => {

    console.log("Profile picture: ", profilePicture)

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={profilePicture} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}