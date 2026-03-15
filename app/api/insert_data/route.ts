import {google} from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({version: 'v4', auth});

    const body = await req.json();
    const {placeName, city, category, mediaLink, person, notes} = body

    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:A'
    })

    const rows = existing.data.values ?? []
    const nextId = rows.length
    try{
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A2:G2',
            valueInputOption: 'USER_ENTERED',
            requestBody:{
                values: [
                    [nextId, placeName, city, category, mediaLink, person, notes]
                ]
            }
        })

        return NextResponse.json({response: response.data}, {status: 200})
    } catch (error: any){
        console.error("Google Sheets error", error?.name, error?.message)
        return NextResponse.json({error: "Error inputting photos from database."}, {status: 500})
    }
}