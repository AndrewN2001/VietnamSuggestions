import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const formatLink = (link: string) => {
    if (link.includes("https://")) return link
    return `https://${link}`
}

export async function GET(req: NextRequest){
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({version: 'v4', auth});

    try{
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A2:Z'
        })
        
        const formattedData = response.data.values?.map((row) => ({
            placeName: row[1],
            city: row[2],
            category: row[3],
            mediaLink: formatLink(row[4]),
            personSubmitted: row[5],
            notes: row[6]
        }))
        // console.log(formattedData)
        return NextResponse.json({response: formattedData}, {status: 200})
    } catch (error: any){
        console.error("Google Sheets error", error?.name, error?.message)
        return NextResponse.json({error: "Error fetching photos from database"})
    }
}