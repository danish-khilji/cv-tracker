import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import FileData from "../../../../data/formData.json"


// API handler for submitting candidate data
export async function POST(req) {
    try {
        // Create a unique ID
        const id = uuidv4();

        const formData = await req.formData()
        const email = formData.get('email');
        const contact = formData.get('contact');
        const dateTime = formData.get('dateTime');
        const status = formData.get('status');
        const selected = formData.get('selected');
        const remarks = formData.get('remarks');

        // Extract PDF file
        const pdfFile = formData.get('file');

        // Prepare data with ID
        const data = {
            id,
            email,
            contact,
            dateTime,
            status,
            selected,
            remarks,
            pdfFileName: `dansih${id}-${pdfFile.name}`, // Unique file name
        };

        // Define file path
        const filePath = path.resolve('./data/formData.json');
        const pdfFilePath = path.resolve(`./public/uploads/${data.pdfFileName}`);

        // Read existing data
        let existingData = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        // Append new data
        existingData.push(data);

        // Write data to file
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        fs.createWriteStream(pdfFilePath);

        return NextResponse.json({
            success: true,
            message: "suucesfuly"
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed",
            error: error
        })
    }
}

export async function GET(req) {
    try {
        console.log("Data ==> ", FileData)
        return NextResponse.json({
            success: true,
            message: "suucesfuly",
            data: FileData
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed",
            error: error
        })
    }
}

// export async function PUT(req) {
//     try {
//         // Parse form data
//         const formData = await req.formData();
//         const id = formData.get('id');
//         const email = formData.get('email');
//         const contact = formData.get('contact');
//         const dateTime = formData.get('dateTime');
//         const status = formData.get('status');
//         const selected = formData.get('selected');
//         const remarks = formData.get('remarks');

//         // Extract PDF file
//         const pdfFile = formData.get('file');

//         // Define file paths
//         const dataFilePath = path.resolve('./data/formData.json');
//         const uploadDir = path.resolve('./public/uploads');

//         if (!id) {
//             return NextResponse.json({ message: 'ID is required!' }, { status: 400 });
//         }

//         // Read existing data
//         let existingData = [];
//         if (fs.existsSync(dataFilePath)) {
//             const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
//             existingData = JSON.parse(fileContent);
//         }

//         // Find the index of the item to update
//         const itemIndex = existingData.findIndex(item => item.id === id);
//         if (itemIndex === -1) {
//             return NextResponse.json({ message: 'Data not found!' }, { status: 404 });
//         }

//         // Update the item
//         existingData[itemIndex] = {
//             ...existingData[itemIndex],
//             email,
//             contact,
//             dateTime,
//             status,
//             selected,
//             remarks,
//         };

//         // Handle PDF file update
//         if (pdfFile && pdfFile.size > 0) {
//             const newPdfFileName = `dansih${id}-${pdfFile.name}`;
//             const newPdfFilePath = path.join(uploadDir, newPdfFileName);

//             // Remove old PDF file if it exists
//             if (existingData[itemIndex].pdfFileName) {
//                 const oldPdfFilePath = path.join(uploadDir, existingData[itemIndex].pdfFileName);
//                 if (fs.existsSync(oldPdfFilePath)) {
//                     fs.unlinkSync(oldPdfFilePath);
//                 }
//             }

//             // Save new PDF file
//             await new Promise((resolve, reject) => {
//                 const fileStream = fs.createWriteStream(newPdfFilePath);
//                 pdfFile.stream().pipe(fileStream);
//                 fileStream.on('finish', resolve);
//                 fileStream.on('error', reject);
//             });

//             // Update PDF file name in data
//             existingData[itemIndex].pdfFileName = newPdfFileName;
//         }

//         // Write updated data to file
//         fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

//         return NextResponse.json({ success: true, message: 'Data updated successfully!' });
//     } catch (error) {
//         console.error('Error updating data:', error);
//         return NextResponse.json({ success: false, message: 'Error updating data!', error: error.message }, { status: 500 });
//     }
// }