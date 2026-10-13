import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import process from 'process';

process.loadEnvFile();

const DATABASE_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.DATA;
const MONGO_URL = process.env.DB_URL;
const PORT = process.env.PORT;

const app = express();
app.use(express.json()); 

let contacts; 

app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API ! Ajoutez /contacts dans l'URL pour voir les données.");
});

app.get('/contacts', async (req, res) => {
    try {
        const results = await contacts.find().toArray();
        const ids = results.map(contact => ({ id: contact._id }));
        res.json(ids);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Identifiant invalide" });
    }

    const contact = await contacts.findOne({ _id: new ObjectId(id) });
    if (!contact) {
        return res.status(404).json({ error: "Contact introuvable" });
    }
    res.json(contact);
});

app.post('/contacts', async (req, res) => {
    const newContact = req.body;
    
    const result = await contacts.insertOne(newContact);
    
    res.status(201).json({ _id: result.insertedId, ...newContact });
});

app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Identifiant invalide" });
    }

    const result = await contacts.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Contact introuvable" });
    }
    res.json({ message: "Contact mis à jour" });
});

app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Identifiant invalide" });
    }

    const result = await contacts.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Contact introuvable" });
    }
    res.json({ message: "Contact supprimé" });
});


async function startServer() {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        console.log("Connecté à MongoDB");
        
        const db = client.db(DATABASE_NAME);
        contacts = db.collection(COLLECTION_NAME);

        app.listen(PORT, () => {
            console.log(`Serveur API démarré sur http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error("Erreur de connexion :", e);
    }
}

startServer();