const jwt = require('jsonwebtoken');
const users = require('../data/users');

const SECRET_KEY = 'uzum_api_secret_123';
const codes = {}; // { phone: { code, expires } }

// 1. Kod yuborish
function sendCode(req, res) {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Telefon raqam kerak' });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    codes[phone] = { code, expires: Date.now() + 5 * 60 * 1000 };

    console.log(`Telefon: ${phone}, Kod: ${code}`);
    res.json({ message: 'Kod yuborildi (console-ga qarang)' });
}

// 2. Kodni tekshirish
function verifyCode(req, res) {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'Telefon va kod kerak' });

    const record = codes[phone];
    if (!record) return res.status(400).json({ message: 'Kod topilmadi yoki muddati o‘tgan' });
    if (record.code !== code) return res.status(400).json({ message: 'Kod noto‘g‘ri' });
    if (Date.now() > record.expires) return res.status(400).json({ message: 'Kod muddati o‘tgan' });

    let user = users.find(u => u.phone === phone);
    if (!user) {
        user = { id: Date.now(), phone };
        users.push(user);
    }

    const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET_KEY, { expiresIn: '1h' });
    delete codes[phone];

    res.json({ message: 'Muvaffaqiyat', token, user });
}

// 3. Profilni olish
function getProfile(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token yo‘q' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token noto‘g‘ri' });

    try {
        const userData = jwt.verify(token, SECRET_KEY);
        const user = users.find(u => u.id === userData.id);
        if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

        res.json({ id: user.id, phone: user.phone });
    } catch {
        res.status(401).json({ message: 'Token yaroqsiz' });
    }
}

module.exports = { sendCode, verifyCode, getProfile };
