import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import { NextResponse,NextRequest } from "next/server";

connectDB();

export async function POST(request :NextRequest){
    try {
        const reqBody=await request.json();
        const {token}=reqBody
        // console.log("api: ",token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry:{$gt: Date.now()}
        })
        if(!user){
            return  NextResponse.json({error:"Invalid Token"},{status:400})
        }
        
        user.isVerified=true;
        user.verifyToken=undefined
        user.verifyTokenExpiry=undefined

        await user.save();

        return  NextResponse.json({
            message:"Email verified successfully",
            success:true
        },{status:200})

    } catch (error :any) {
        return  NextResponse.json({error:error.message},{status:500})
    }
}
