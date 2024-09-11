import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import FileData from "../../../../data/formData.json"


export async function POST(req) {
    try {
        const id = uuidv4();

        // Parse form data
        const formData = await req.formData();
        const email = formData.get('email');
        const contact = formData.get('contact');
        const dateTime = formData.get('dateTime');
        const status = formData.get('status');
        const selected = formData.get('selected');
        const remarks = formData.get('remarks');
        const pdfFile = formData.get('file');

        const pdfFileName = `dansih${id}-${pdfFile.name}`;
        const pdfFilePath = path.resolve(`./public/uploads/${pdfFileName}`);

        const data = {
            id,
            email,
            contact,
            dateTime,
            status,
            selected,
            remarks,
            pdfFileName
        };

        // Define file paths
        const filePath = path.resolve('./data/formData.json');

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

        // Save PDF file
        const buffer = await pdfFile.arrayBuffer();
        fs.writeFileSync(pdfFilePath, Buffer.from(buffer));

        return NextResponse.json({
            success: true,
            message: "Successfully created record!"
        });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to create record",
            error: error.message
        });
    }
}
export async function GET(req) {
    try {
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

export async function PUT(req) {
    try {
        // Parse form data
        const formData = await req.formData();
        const id = formData.get('id');
        const email = formData.get('email');
        const contact = formData.get('contact');
        const dateTime = formData.get('dateTime');
        const status = formData.get('status');
        const selected = formData.get('selected');
        const remarks = formData.get('remarks');
        const pdfFile = formData.get('file');

        if (!id) {
            return NextResponse.json({ message: 'ID is required!' }, { status: 400 });
        }

        // Define file paths
        const dataFilePath = path.resolve('./data/formData.json');
        const uploadDir = path.resolve('./public/uploads');

        // Read existing data
        let existingData = [];
        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        // Find the index of the item to update
        const itemIndex = existingData.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            return NextResponse.json({ message: 'Data not found!' }, { status: 404 });
        }

        // Update the item
        existingData[itemIndex] = {
            ...existingData[itemIndex],
            email,
            contact,
            dateTime,
            status,
            selected,
            remarks,
        };

        // Handle PDF file update
        if (pdfFile && pdfFile.size > 0) {
            const newPdfFileName = `rao320${id}-${pdfFile.name}`;
            const newPdfFilePath = path.join(uploadDir, newPdfFileName);

            // Remove old PDF file if it exists
            if (existingData[itemIndex].pdfFileName) {
                const oldPdfFilePath = path.join(uploadDir, existingData[itemIndex].pdfFileName);

                // Log the paths for debugging
                console.log(`Attempting to delete old PDF file at: ${oldPdfFilePath}`);

                if (fs.existsSync(oldPdfFilePath)) {
                    fs.unlinkSync(oldPdfFilePath);
                    console.log(`Successfully deleted old PDF file: ${oldPdfFilePath}`);
                } else {
                    console.warn(`Old PDF file does not exist: ${oldPdfFilePath}`);
                }
            }

            // Save new PDF file
            const buffer = await pdfFile.arrayBuffer();
            await fs.promises.writeFile(newPdfFilePath, Buffer.from(buffer));

            // Update PDF file name in data
            existingData[itemIndex].pdfFileName = newPdfFileName;
        }

        // Write updated data to file
        await fs.promises.writeFile(dataFilePath, JSON.stringify(existingData, null, 2));

        return NextResponse.json({ success: true, message: 'Data updated successfully!' });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ success: false, message: 'Error updating data!', error: error.message }, { status: 500 });
    }
}



export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "ID is required"
            });
        }

        // Define file paths
        const dataFilePath = path.resolve('./data/formData.json');
        const uploadsDir = path.resolve('./public/uploads/');

        // Read existing data
        let existingData = [];
        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        // Find and remove the data entry by ID
        const newData = existingData.filter(item => item.id !== id);
        if (existingData.length === newData.length) {
            return NextResponse.json({
                success: false,
                message: "Record not found"
            });
        }

        // Write updated data to file
        fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));

        // Remove the associated PDF file
        const pdfFile = existingData.find(item => item.id === id)?.pdfFileName;
        if (pdfFile) {
            const pdfFilePath = path.resolve(uploadsDir, pdfFile);
            if (fs.existsSync(pdfFilePath)) {
                fs.unlinkSync(pdfFilePath);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Successfully deleted record and file!"
        });
    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete record or file",
            error: error.message
        });
    }
}