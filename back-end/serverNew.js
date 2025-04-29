import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import multer from 'multer';
import xlsx from 'xlsx';

const app = express();

app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

async function startServer() {
  try {
    const db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pramudita',
    });

    app.post('/api/signup', async (req, res) => {
      const { namaLengkap, name, email, password, asalSekolah, jurusan } = req.body;
      const role = "siswa"
      console.log(namaLengkap);
      console.log(name);
      console.log(email);
      console.log(password);
      console.log(asalSekolah);
      console.log(jurusan);
    
      try {
         // Cek apakah email sudah terdaftar
        const [rows] = await db.execute('SELECT id_siswa FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
          return res.status(400).json({ message: 'Email already registered.' });
        }
    
        // Simpan ke database (tanpa hash password)
        // Enkripsi password sebelum simpan ke DB
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await db.execute(
          'INSERT INTO users (nama_lengkap, username, email, password, asal_sekolah, jurusan, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [namaLengkap, name, email, hashedPassword, asalSekolah, jurusan, role]
        );
    
        res.status(201).json({ message: 'User registered successfully!' });
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error.' });
      }
    });

    app.post('/api/signupbk', async (req, res) => {
      const { namaLengkap, name, email, password, asalSekolah} = req.body;
      const role = "bk"
      console.log(namaLengkap);
      console.log(name);
      console.log(email);
      console.log(password);
      console.log(asalSekolah);
    
      try {
         // Cek apakah email sudah terdaftar
        const [rows] = await db.execute('SELECT id_bk FROM bk WHERE email = ?', [email]);
        console.log(rows);
        if (rows.length > 0) {
          return res.status(400).json({ message: 'Email already registered.' });
        }
    
        // Simpan ke database (tanpa hash password)
        // Enkripsi password sebelum simpan ke DB
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await db.execute(
          'INSERT INTO bk (nama_lengkap, username, email, password, asal_sekolah, role) VALUES (?, ?, ?, ?, ?, ?)',
          [namaLengkap, name, email, hashedPassword, asalSekolah, role]
        );
    
        res.status(201).json({ message: 'User registered successfully!' });
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error.' });
      }
    });

    app.post('/api/signin', async (req, res) => {
      const { email, password, jurusanLogin } = req.body;

      if (!email || !password || !jurusanLogin) {
        return res.status(400).json({ message: 'Email, password, and jurusan are required.' });
      }

      if (jurusanLogin == 'ipa' || jurusanLogin == 'ips') {
        try {
          const [rows] = await db.execute('SELECT id_siswa, nama_lengkap, username, email, password, asal_sekolah, jurusan FROM users WHERE email = ? AND jurusan = ?', [email, jurusanLogin]);

          if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
          }

          const user = rows[0];
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
          } else {
            res.status(200).json({ message: 'Successfully logged in', user: { 
              id: user.id, 
              fullname: user.nama_lengkap,
              username: user.username, 
              email: user.email,
              asal_sekolah: user.asal_sekolah,
              jurusan: user.jurusan 
            } });
            console.log(user)
          }
        } catch (err) {
          console.error('Signin error:', err);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

      if (jurusanLogin == 'bk') {
        try {
          const [rows] = await db.execute('SELECT id_bk, nama_lengkap, username, email, password, asal_sekolah FROM bk WHERE email = ?', [email]);

          if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
          }

          const user = rows[0];
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
          } else {
            res.status(200).json({ message: 'Successfully logged in', user: { 
              id: user.id, 
              fullname: user.nama_lengkap,
              username: user.username, 
              email: user.email,
              asal_sekolah: user.asal_sekolah
            } });
            console.log(user)
          }
        } catch (err) {
          console.error('Signin error:', err);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    });

    app.get('/api/subjects', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT DISTINCT major FROM universities');
        res.json(rows.map(row => row.major));
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch subjects' });
      }
    });

    app.get('/api/locations', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT DISTINCT location FROM universities');
        res.json(rows.map(row => row.location));
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch locations' });
      }
    });

    app.get('/api/careers', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT DISTINCT career_prospect FROM universities');
        res.json(rows.map(row => row.career_prospect));
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch careers' });
      }
    });

    app.get('/api/salaries', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT DISTINCT salary_range FROM universities');
        res.json(rows.map(row => row.salary_range));
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch salaries' });
      }
    });

    app.post('/api/universities/filter', async (req, res) => {
      const { subject, location, career, salary } = req.body;

      try {
        let query = 'SELECT * FROM universities WHERE 1=1';
        const params = [];

        if (subject) {
          query += ' AND major = ?';
          params.push(subject);
        }
        if (location) {
          query += ' AND location = ?';
          params.push(location);
        }
        if (career) {
          query += ' AND career_prospect = ?';
          params.push(career);
        }
        if (salary) {
          query += ' AND salary_range = ?';
          params.push(salary);
        }

        const [rows] = await db.execute(query, params);

        const formattedRows = rows.map(row => {
          if (typeof row.companies === 'string') {
            try {
              row.companies = JSON.parse(row.companies);
            } catch {
              row.companies = [row.companies];
            }
          }
          return row;
        });

        res.json(formattedRows);
      } catch (err) {
        console.error('Filter error:', err);
        res.status(500).json({ message: 'Failed to fetch filtered universities' });
      }
    });

    app.post('/api/upload-student-data-ips', upload.single('file'), async (req, res) => {
      const { schoolName, jurusan } = req.body;
      const file = req.file;
    
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    
      try {
        // Baca file Excel
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
        // Nama tabel format: nama_sekolah_jurusan (contoh: sman1_ipa)
        const tableName = `${schoolName.replace(/\s+/g, '_').toLowerCase()}_${jurusan.toLowerCase()}`;
    
        // Buat tabel baru
        await db.execute(`
          CREATE TABLE IF NOT EXISTS \`${tableName}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama_siswa VARCHAR(255),
            ekonomi DECIMAL(4),
            geografi DECIMAL(4),
            sejarah DECIMAL(4),
            sosiologi DECIMAL(4)
          )
        `);
    
        // Insert data ke tabel
        for (const row of jsonData) {
          const { nama, ekonomi, geografi, sejarah, sosiologi } = row;
          
          await db.execute(
            `INSERT INTO \`${tableName}\` (nama_siswa, ekonomi, geografi, sejarah, sosiologi) VALUES (?, ?, ?, ?, ?)`,
            [nama, ekonomi, geografi, sejarah, sosiologi]
          );
        }
    
        res.status(200).json({ message: 'Data berhasil di-upload dan tabel berhasil dibuat!' });
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Gagal upload data.' });
      }
    });    

    app.post('/api/get-subject-data', async (req, res) => {
      const { tableName, subject } = req.body;
      
      if (!tableName || !subject) {
        return res.status(400).json({ message: 'Table name and subject are required.' });
      }
    
      try {
        const [rows] = await db.execute(
          `SELECT nama_siswa, \`${subject}\` FROM \`${tableName}\` ORDER BY \`${subject}\` DESC`
        );        
        res.json({ data: rows });
      } catch (err) {
        console.error('Error fetching subject data:', err);
        res.status(500).json({ message: 'Failed to fetch subject data.' });
      }
    });  
    
    app.post('/api/get-all-subjects-data-ips', async (req, res) => {
      const { tableName } = req.body;
    
      if (!tableName) {
        return res.status(400).json({ message: 'Table name is required.' });
      }
    
      try {
        const [rows] = await db.execute(`
          SELECT 
            nama_siswa,
            ekonomi,
            geografi,
            sejarah,
            sosiologi,
            ROUND((ekonomi + geografi + sejarah + sosiologi) / 4, 2) AS rata_rata
          FROM \`${tableName}\`
          ORDER BY rata_rata DESC
        `);
    
        res.json({ data: rows });
      } catch (err) {
        console.error('Error fetching all subjects data:', err);
        res.status(500).json({ message: 'Failed to fetch all subjects data.' });
      }
    });    

    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

startServer();
