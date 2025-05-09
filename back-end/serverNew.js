import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from "fs";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'

const app = express();
const upload = multer({ dest: 'uploads/' });
const uploadProdi = multer({ dest: "uploads/prodi" });
const JWT_SECRET = 'Pr4mud1Ta_0Tw_1M';

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());

// Middleware verifikasi JWT
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

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
      try {
        let user;
        if (jurusanLogin === 'ipa' || jurusanLogin === 'ips') {
          const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND jurusan = ?', [email, jurusanLogin]);
          if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
          user = rows[0];
        } else if (jurusanLogin === 'bk') {
          const [rows] = await db.execute('SELECT * FROM bk WHERE email = ?', [email]);
          if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
          user = rows[0];
        } else {
          return res.status(400).json({ message: 'Invalid jurusanLogin' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
          id: jurusanLogin === 'bk' ? user.id_bk : user.id_siswa,
          name: user.nama_lengkap,
          username: user.username,
          email: user.email,
          asal_sekolah: user.asal_sekolah,
          jurusan: user.jurusan,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

        res.status(200).json({ message: 'Successfully logged in', user: payload });
      } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ message: 'Internal server error' });
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
            ekonomi FLOAT(4),
            geografi FLOAT(4),
            sejarah FLOAT(4),
            sosiologi FLOAT(4)
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
            CAST(ekonomi AS DECIMAL(5,2)) AS ekonomi,
            CAST(geografi AS DECIMAL(5,2)) AS geografi,
            CAST(sejarah AS DECIMAL(5,2)) AS sejarah,
            CAST(sosiologi AS DECIMAL(5,2)) AS sosiologi,
            ROUND((
              CAST(ekonomi AS DECIMAL(5,2)) +
              CAST(geografi AS DECIMAL(5,2)) +
              CAST(sejarah AS DECIMAL(5,2)) +
              CAST(sosiologi AS DECIMAL(5,2))
            ) / 4, 2) AS rata_rata
          FROM \`${tableName}\`
          ORDER BY rata_rata DESC
        `);        
    
        res.json({ data: rows });
      } catch (err) {
        console.error('Error fetching all subjects data:', err);
        res.status(500).json({ message: 'Failed to fetch all subjects data.' });
      }
    });    

    app.post("/upload-prodi", uploadProdi.single("file"), async (req, res) => {
      const file = req.file;
      const year = req.body.year;
      const tableName = `prodi_${year}`;
    
      if (!file || !year) {
        return res.status(400).json({ message: "File dan tahun wajib diisi." });
      }
    
      try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
    
        const columns = [
          "Program_Studi VARCHAR(255)",
          "Universitas VARCHAR(255)",
          "Jenjang VARCHAR(100)",
          "Daya_Tampung INT",
          "Peminat INT",
          "Jenis_Portofolio VARCHAR(255)",
          "Jurusan_SMA VARCHAR(3)",
          "Mata_Pelajaran_Relevan VARCHAR(255)"
        ];
    
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS \`${tableName}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ${columns.join(",")}
          )
        `;
    
        await db.execute(createTableQuery);
    
        const insertQuery = `
          INSERT INTO \`${tableName}\`
          (Program_Studi, Universitas, Jenjang, Daya_Tampung, Peminat, Jenis_Portofolio, Jurusan_SMA, Mata_Pelajaran_Relevan)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    
        for (const row of jsonData) {
          await db.execute(insertQuery, [
            row["Program Studi"] ?? null,
            row["Universitas"] ?? null,
            row["Jenjang"] ?? null,
            row["Daya Tampung"] ?? null,
            row["Peminat"] ?? null,
            row["Jenis Portofolio"] ?? null,
            row["Jurusan SMA"] ?? null,
            row["Mata Pelajaran yang Relevan"] ?? null
          ]);          
        }
    
        fs.unlinkSync(file.path); // Hapus file setelah selesai
        res.json({ message: `Data berhasil diunggah ke tabel ${tableName}` });
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat memproses file." });
      }
    });    

    app.get('/api/program-studi/:subject', async (req, res) => {
      const subject = req.params.subject.trim();
      console.log('👉 Received subject:', subject);
      try {
          const [rows] = await db.execute(
              'SELECT * FROM prodi_2025 WHERE LOWER(Mata_Pelajaran_Relevan) LIKE ?',
              [`%${subject.toLowerCase()}%`]
          );
          console.log('✅ Query result:', rows.length, 'rows');
          res.json({ data: rows });
      } catch (error) {
          console.error('❌ Database error:', error);
          res.status(500).json({ error: 'Failed to fetch program studi', details: error.message });
      }
    });  

    app.get('/verify-token', (req, res) => {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ valid: false });
      }
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ valid: false });
        }
        return res.json({ valid: true, username: decoded.username });
      });
    });

    app.get('/api/me', verifyToken, (req, res) => {
      res.status(200).json({ user: req.user });
    });

    app.post('/api/logout', (req, res) => {
      res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
      res.json({ success: true });
    });
    
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

startServer();