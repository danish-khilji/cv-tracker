// src/app/components/CVTable.js

'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import BasicTable from './Table';
import FormModal from './FormModal';

// Modal.setAppElement('#__next');

const CVTable = () => {
    const [rows, setRows] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [formData, setFormData] = useState({
        contact: '',
        email: '',
        dateTime: '',
        status: '',
        selected: '',
        remarks: '',
        file: null
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/upload');
            const data = await response.json();
            setRows(data.data);
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddRow = () => {
        setRows([...rows, {
            cvUrl: '',
            cvName: '',
            contact: '',
            email: '',
            dateTime: '',
            status: '',
            selected: '',
            remarks: ''
        }]);
    };

    const handleUpload = async () => {
        const file = formData.file;
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('contact', formData.contact);
        uploadData.append('email', formData.email);
        uploadData.append('dateTime', formData.dateTime);
        uploadData.append('status', formData.status);
        uploadData.append('selected', formData.selected);
        uploadData.append('remarks', formData.remarks);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData
        });

        const result = await response.json();
        if (response.ok) {
            setRows([...rows, result]);
            setFormData({
                contact: '',
                email: '',
                dateTime: '',
                status: '',
                selected: '',
                remarks: '',
                file: null
            });
        }
    };

    const handleDownload = (cvUrl, cvName) => {
        window.open(cvUrl, '_blank');
    };

    const handlePreview = (cvUrl) => {
        setPreviewFile(cvUrl);
        setModalIsOpen(true);
    };

    return (
        <div>
            <BasicTable />
            <FormModal />

            <button onClick={handleAddRow}>+ Add New Row</button>

            {/* Modal for file preview */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Preview"
            >
                <button onClick={() => setModalIsOpen(false)}>Close</button>
                {previewFile && (
                    <div>
                        <iframe src={previewFile} width="100%" height="600px" />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CVTable;
