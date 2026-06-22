const User = require('../models/User');

const seedUsers = async () => {
  try {
    const users = [
      {
        name: 'Administrador',
        email: 'admin@email.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Usuário Padrão',
        email: 'user@email.com',
        password: 'user123',
        role: 'user',
      },
    ];

    for (const userData of users) {
      const exists = await User.findOne({ where: { email: userData.email } });
      if (!exists) {
        await User.create(userData);
        console.log(`✅ Usuário criado: ${userData.email}`);
      }
    }
  } catch (err) {
    console.error('❌ Erro no seed de usuários:', err.message);
  }
};

module.exports = seedUsers;