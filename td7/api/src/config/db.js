import { connect, disconnect } from 'mongoose';
import { faker } from '@faker-js/faker';
import Contact from '../models/contactModel.js';

process.loadEnvFile()

export async function populateDB() {
    try {
        const count = await Contact.countDocuments();
        if (count === 0) {
            const fakeContacts = [];
            for (let i = 0; i < 10; i++) {
                fakeContacts.push({
                    name: faker.person.fullName(),
                    age: faker.number.int({ min: 18, max: 80})
                });
            }
            await Contact.insertMany(fakeContacts);
        }
    } catch (err) {
        console.error(err);
    }
}

async function connectDB() {
    try {
        console.log("Opening connection");
        const conn = await connect(process.env.MONGO_URI + '/' + process.env.DB_NAME, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await populateDB();
    } catch(err) { 
        disconnect();
        console.error(err);
        process.exit(1);
    }
}

export default connectDB
