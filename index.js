const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 模擬資料庫
let contacts = [
  { id: 1, name: '張三', phone: '0912345678', address: '台北市' },
  { id: 2, name: '李四', phone: '0923456789', address: '新北市' },
];

// GET - 獲取所有聯絡人
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

// GET - 獲取單個聯絡人
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === parseInt(req.params.id));
  if (!contact) {
    return res.status(404).json({ error: '找不到該聯絡人' });
  }
  res.json(contact);
});

// POST - 創建新聯絡人
app.post('/api/contacts', (req, res) => {
  const { name, phone, address } = req.body;
  
  // 簡單的驗證
  if (!name || !phone || !address) {
    return res.status(400).json({ error: '所有欄位都是必填的' });
  }

  const newContact = {
    id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    name,
    phone,
    address
  };
  
  contacts.push(newContact);
  res.status(201).json(newContact);
});

// PUT - 更新聯絡人
app.put('/api/contacts/:id', (req, res) => {
  const { name, phone, address } = req.body;
  const id = parseInt(req.params.id);
  
  const contactIndex = contacts.findIndex(c => c.id === id);
  if (contactIndex === -1) {
    return res.status(404).json({ error: '找不到該聯絡人' });
  }

  contacts[contactIndex] = {
    ...contacts[contactIndex],
    name: name || contacts[contactIndex].name,
    phone: phone || contacts[contactIndex].phone,
    address: address || contacts[contactIndex].address
  };

  res.json(contacts[contactIndex]);
});

// DELETE - 刪除聯絡人
app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({ error: '找不到該聯絡人' });
  }

  contacts = contacts.filter(c => c.id !== id);
  res.json({ message: '聯絡人已成功刪除' });
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}