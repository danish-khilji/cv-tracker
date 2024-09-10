'use client';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable() {
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/upload');
            const data = await response.json();
            console.log("user ===> ", data)
            setRows(data.data);
        };
        fetchData();
    }, []);
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="right">Contact</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Interview Date and Time</TableCell>
                        <TableCell align="right">Interview Status</TableCell>
                        <TableCell align="right">Selected</TableCell>
                        <TableCell align="right">Remarks</TableCell>
                        <TableCell>Candidate CV</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="right">{row.contact}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.dateTime}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                            <TableCell align="right">{row.selected}</TableCell>
                            <TableCell align="right">{row.remarks}</TableCell>
                            <TableCell component="th" scope="row">
                                <a href={`/uploads/${row.pdfFileName}`} target="_blank" rel="noopener noreferrer">
                                    Preview
                                </a>
                                /
                                <a href={`/uploads/${row.pdfFileName}`} download>
                                    download
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
