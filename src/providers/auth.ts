import type {AuthProvider} from "@refinedev/core";
import {User, SignUpPayload } from "@/types";
import {authClient} from "@/lib/auth-client";
import { User } from "lucide-react";


export const authProvider: AuthProvider ={
    register: async ({
        email,
        password,
        name,
        role,
        image,
        imageCldPubId,
    } : SignUpPayload) =>{

        try{
            const {data, error} = await authClient.signUp.email({
                name,
                email,
                password,
                image,
                role,
                imageCldPubId,
            } as SignUpPayload );
            
            if(error){
                return{
                    success:false,
                    error: {
                        name: "Registration Failed",
                        message:
                            error?.message || "Unable to create an account. Please try again",
                    }
                }
            }

            //store user data locally
            localStorage.setItem("user", JSON.stringify(data.user));

            return {
                success: true,
                redirectTo: "/"
            }

        } catch (error){
            console.log("Register error", error);
            return{
                success: false,
                error: {
                    name: "Registration Failed",
                    message: "Unable to create account. Please try again.",
                }
            }
        }
        
    },


    login: async ({email, password}) =>{
    try{
        const {data, error} = await authClient.signIn.email({
            email:email,
            password: password,
        })

        if(error){
            console.error("Login error from auth client:", error)
            const message = typeof error?.message === "string" && error.message.toLowerCase().includes("verify")
                ? "Please verify your email before signing in."
                : error?.message || "Please try again later";
            return{
                success: false,
                error:{
                    name: "Log in failed",
                    message,
                }
            }
        }

        //store user data
        localStorage.setItem("user",JSON.stringify(data.user));

        return{
            success:true,
            redirectTo:"/",
        }
    }catch {
        return{
            success: false,
            error: {
                name: "Log in failed",
                message: "Please try again later."
            }
        }
    }
    },
    
    logout: async() =>{
        const {error} = await authClient.signOut();

        if(error){
            console.error("Logout error:", error);
            return{
                success: false,
                error: {
                    name:"Logout failed",
                    message: "Unable to log out. Try again later."
                }
            }
        }

        localStorage.removeItem("user");

        return{
            success: true,
            redirectTo:"/login",
        }
    },

    onError: async(error) => {
        if(error.response?.status ===401){
            return {
                logout:true,
            }
        }
        return {error };
    },
    
    check:async()=>{
        const user = localStorage.getItem("user");

        if(user){
            return{
                authenticated:true,
            }
        }

        return{
            authenticated:false,
            logout: true,
            redirectTo: "/login",
            error:{
                name: "Unauthorized",
                message: "Check Failed."
            }
        }
    },

    getPermissions: async() =>{
        const user = localStorage.getItem("user");

        if(!user) return null;
        const parsedUser : User = JSON.parse(user);

        return{
            role:parsedUser.role,
        }
        
    },

    getIdentity: async()=>{
        const user = localStorage.getItem("user");

        if(!user) return null;

        const parsedUser: User = JSON.parse(user);

        return{
            id: parsedUser.id,
            name: parsedUser.name,
            email:parsedUser.email,
            image:parsedUser.image,
            role:parsedUser.role,
            imageCldPubUd: parsedUser.imageCldPubId,
        }
    }

}

