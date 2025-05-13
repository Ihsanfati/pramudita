import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import SidebarBK from './components/SidebarBK';
import NavbarBK from './components/NavbarBK';

const BK = ({ user }) => {
  const [data, setData] = useState([]);
  const [jurusan, setJurusan] = useState('IPS');
  const [pilihan, setPilihan] = useState('Pilihan 1');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:5000/api/data-pilihan?asal_sekolah=${user.asal_sekolah}&jurusan=${jurusan}&pilihan=${pilihan}`);
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, [jurusan, pilihan]);

  return (
    <Box display="flex">
      <SidebarBK setJurusan={setJurusan} setPilihan={setPilihan} />
      <Box flexGrow={1}>
        <NavbarBK />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Lengkap</TableCell>
              <TableCell>Pilihan</TableCell>
              <TableCell>Universitas</TableCell>
              <TableCell>Program Studi</TableCell>
              <TableCell>Ranking Paralel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.nama_lengkap}</TableCell>
                <TableCell>{row.pilihan}</TableCell>
                <TableCell>{row.universitas}</TableCell>
                <TableCell>{row.program_studi}</TableCell>
                <TableCell>{row.ranking_paralel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default BK;