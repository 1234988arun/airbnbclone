// import axios from "axios";
// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";


// export const authOptions:NextAuthOptions={
//     providers:[
//         CredentialsProvider({
//             name:'Credentials',
//             credentials:{
//                 email:{label:"Email", name:"email"},
//                 password:{label:"Password", name:"password"},
//             },
//               async authorize(credentials) {
//                 // login logic yahan
//                 const payload ={
//                     email:credentials?.email,
//                     password:credentials?.password,
//                 }
//                 console.log("AUTHORIZE HIT", credentials);
//                 //authorize() mein API call isliye hai kyunki NextAuth ko backend se verify karwana hai ki email/password sahi hain.
//                 try{
//                     const {data} = await axios.post(`${process.env.SERVER}/api/auth/login`, payload)
//                     console.log("USER RETURNING", data);
//                     return data 
//                 }
//                 catch(err:unknown){
//                       console.log("LOGIN ERROR:", err.response?.data || err.message);
//                     return null
//                 }
//             }
//         }   
//         )
//     ],
//     pages: {
//         signIn: "/login",
//     },
// }

// const handler = NextAuth(authOptions)

// export {handler as GET, handler as POST}

import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface CustomSessionInterface {
    user:{
        id:string
        email:string
        name:string
    }
}

export const authOptions:NextAuthOptions ={
    secret: process.env.AUTH_SECRET,
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                email:{label:"Email", name:"email"},
                password:{label:"Password", name:"password"}
            },
            async authorize(credentials){
                const payload={
                  email: credentials?.email,
                  password: credentials?.password
                }
                try{
                  const {data} = await axios.post('https://airbnbclone-l5zl.onrender.com/api/auth/login', payload)
                  // Backend login API ko email/password bhejkar user ko verify karwate hain
                // Agar credentials correct hain to backend user ka data return karega

                  console.log(data)
                  return data
                }
                // catch(err:unknown){
                //     console.log(err)
                //  return null
                // }
                // app/api/auth/[...nextauth]/route.ts

                catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    return "/auth/auth-failed?error=SignupRequired";
                }

                console.log(err);
                return false;
                }
            }
        }),
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    pages: {
        signIn: "/login",
        error: "/auth/auth-failed"
    },
    session:{
        strategy:'jwt'
    },
    callbacks:{
       async signIn({user,account}){
        if(account?.provider === "google"){
            const payload={
                  email: user.email,
                provider: account.provider,
                }
                try{
                  const {data} = await axios.post('https://airbnbclone-l5zl.onrender.com/api/auth/login', payload)
                  user.id = data.id
                  user.email = data.email
                  user.name = data.name
                  return true
                }
            //     catch (err: unknown) {
            //         if (axios.isAxiosError(err) && err.response?.status === 404) {
            //             return "/auth/auth-failed?error=SignupRequired";
            //         }

            //         return "/auth/auth-failed?error=AccessDenied";
            //    }
            catch{
                return "/auth/auth-failed"
            }
        }
        return true
       },

        async jwt({token,user}){
            if(user){
                token.id = user.id
                //jwt() login ke time user ki information (yahan user.id) ko JWT token mein save karta hai, taaki baad mein session mein use kiya ja sake.
            }
            return token
        },
      async session({session,token}){
        const customSesson = session as unknown as  CustomSessionInterface
        if(token){
            customSesson.user.id = token.id as string
        }
        return session
      }
    }


    //simple: login ke baad user.id ko JWT token mein save karte hain, aur baad mein session ka data token se nikala ja sakta hai.
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
