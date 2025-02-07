import dbConnect from '@/lib/db';
import UserModel from '@/models/user.schema';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs'



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "xyz001@coolmail.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },

            async authorize(credentials: any) : Promise<any>{
                await dbConnect();

                console.log("Credentials: ", credentials);

                try {
                    
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this credentials.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(!isPasswordCorrect){
                        throw new Error("Incorrect Password.")
                    }

                    return user;

                } catch (error: any) {
                    throw new Error(error);
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }){

            if(account?.provider === 'google'){
                await dbConnect();

                console.log(profile);

                const existingUser = await UserModel.findOne({
                    email: profile?.email
                });

                if(!existingUser){
                    const newUser = new UserModel({
                        username: profile?.name?.split(" ")[0].toLowerCase().concat((Math.random()*Math.pow(10,6)).toString()) || profile?.email?.split('@')[0].concat((Math.random()*Math.pow(10,6)).toString()),
                        fullname: profile?.name,
                        email: profile?.email,
                        gender: null,
                        age: null,
                        password: "",
                        profilePicture: profile?.image,
                        oAuth: true
                    })

                    await newUser.save();
                }
            }

            return true;
        },
        async jwt({ token, user, account, profile }){
            if(user){
                token._id = user._id?.toString();
                token.username = user.username;
                token.picture = user.profilePicture;
            }

            if( account && account.provider === 'google' ){
                token._id = token.sub;
                
                //*To generate unique username for everone
                token.username = profile?.name?.split(" ")[0].toLowerCase().concat((Math.random()*Math.pow(10,6)).toString()) || profile?.email?.split('@')[0].concat((Math.random()*Math.pow(10,6)).toString());

                token.picture = profile?.picture;

            }

            return token;
        },
        async session({session, token}) {
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.profilePicture = token.picture || "";
            }

            console.log("session callback", session, token);
            return session;

        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}