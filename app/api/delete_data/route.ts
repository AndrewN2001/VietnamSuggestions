import {google} from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest){
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({version: 'v4', auth});

    async function deleteRow(spreadSheetId: string, rowIndex: number) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadSheetId,
            requestBody: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: "ROWS",
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1
                            }
                        }
                    }
                ]
            }
        })
    }


    try{
        const {rowIndex} = await req.json();
        if (typeof rowIndex !== "number" || rowIndex <= 0) {
            return NextResponse.json({error: "Invalid row index"}, {status: 400})
        }
        await deleteRow(process.env.GOOGLE_SHEET_ID ?? "", rowIndex)
        return NextResponse.json({message: "Row deleted successfully"}, {status: 200})
    } catch (error: any){
        console.error("Google Sheets error", error?.name, error?.message)
        return NextResponse.json({error: "Error deleting data from database."}, {status: 500})
    }
}