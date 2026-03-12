import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({version: 'v4', auth});

export async function GET(req: NextRequest){
    try{
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A2:Z'
        })
        return NextResponse.json({response: response.data?.values}, {status: 200})
    } catch (error: any){
        console.error("Google Sheets error", error?.name, error?.message)
        return NextResponse.json({error: "Error fetching photos from database"})
    }
}