const bcrypt = require('bcryptjs');

// Hash passwords before storing
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Test users for ChronoTrack
const seedUsers = async () => {
  const users = [
    {
      id: 1,
      name: 'HoD User',
      email: 'hod@chronotrack.com',
      password: await hashPassword('hod123'),
      role: 'hod'
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@chronotrack.com',
      password: await hashPassword('admin123'),
      role: 'admin'
    }
  ];

  console.log('Test Users Created:');
  console.log(users);
  return users;
};

seedUsers();