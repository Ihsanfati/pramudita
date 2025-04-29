import express from 'express';
import mysql from 'mysql2/promise'; // Pastikan menggunakan promise API
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();

app.use(cors());
app.use(express.json());

// Setup koneksi MySQL dalam fungsi async
async function startServer() {
  try {
    const db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',  // Sesuaikan dengan password MySQL Anda
      database: 'pramudita',  // Sesuaikan dengan nama database yang Anda gunakan
    });

    app.post('/api/signup', async (req, res) => {
      const { namaLengkap, name, email, password, asalSekolah, jurusan } = req.body;
      const role = "siswa"

      // Validasi sederhana
      if (!namaLengkap || !name || !email || !password || asalSekolah || jurusan) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

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
          'INSERT INTO users (nama_lengkap, name, email, password, asal_sekolah, jurusan, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [namaLengkap, name, email, hashedPassword, asalSekolah, jurusan, role]
        );


        res.status(201).json({ message: 'User registered successfully!' });
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error.' });
      }
    });

    app.post('/api/signin', async (req, res) => {
      const { email, password } = req.body;
      console.log(email);
      console.log(password);

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      try {
        // Cari user berdasarkan email
        const [rows] = await db.execute('SELECT id, name, email, password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        // Cek apakah password yang dimasukkan cocok dengan yang ada di database
        console.log('Stored hash:', user.password);
        console.log('Incoming password:', password);
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        } else {
          // Jika berhasil login
          res.status(200).json({ message: 'Successfully logged in', user: { id: user.id, name: user.name, email: user.email } });
        }
      } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.get('/api/universities', async (req, res) => {
      const { subject, location, career, salary } = req.query;
    
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
        query += ' AND salary_range LIKE ?';
        params.push(`%${salary}%`);
      }
    
      try {
        const [rows] = await db.execute(query, params);
        rows.forEach(row => {
          if (typeof row.companies === 'string') {
            row.companies = JSON.parse(row.companies);
          }
        });
        res.json(rows);
      } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({ error: 'Internal server error' });
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
