const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Clear existing users
        await User.deleteMany();
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create dummy volunteer
        await User.create({
            name: 'John Doe',
            email: 'volunteer@campuseats.com',
            password: hashedPassword
        });

        console.log('Database seeded successfully!');
        console.log('Login Email: volunteer@campuseats.com');
        console.log('Login Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
