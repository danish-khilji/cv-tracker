import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function FormModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [formData, setFormData] = React.useState({
        contact: '',
        email: '',
        dateTime: '',
        status: '',
        selected: '',
        remarks: '',
        file: null
    });

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                        />
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Contact"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleInputChange}
                            placeholder="Interview Date and Time"
                        />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="">Select...</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="On-Hold">On-Hold</option>
                            <option value="Done">Done</option>
                        </select>
                        <select
                            name="selected"
                            value={formData.selected}
                            onChange={handleInputChange}
                        >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <input
                            type="text"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            placeholder="Remarks"
                        />
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}