import { Router } from 'express';
import { getAllContacts, getContactById, updateContact, removeContact, addContact } from '../controllers/contactController.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', function (req, res) {
    res.status(200).json({
        status: 'API is Working',
        message: 'Welcome!',
    });
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     description: Add a new user
 *     responses:
 *       '201':
 *         description: User successfully created
 *       '400':
 *         description: Email already used
 */
router.post('/auth/register', async (req, res) => {
    let response = await registerUser(req.body);
    if (response.success === true) {
        res.status(201).json(response);
    } else {
        res.status(400).json(response);
    }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     description: Connect a user and retrieve the JWT token
 *     responses:
 *       '200':
 *         description: Connection successful, returns the token
 *       '401':
 *         description: Invalid ID
 */
router.post('/auth/login', async (req, res) => {
    let response = await loginUser(req.body);
    if (response.success === true) {
        res.status(200).json(response);
    } else {
        res.status(401).json(response);
    }
});

router.use('/contacts', requireAuth);

/**
 * @openapi
 * /contacts:
 *   get:
 *     description: All contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all the contacts
 *       '404':
 *         description: Contacts not found
 *   post:
 *     description: Add a new contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Contact successfully created
 *       '404':
 *         description: Bad request
 */
router.route('/contacts')
    .get(async (req, res) => {
        let response = await getAllContacts();
        if (response.success == true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    })
    .post(async (req, res) => {
        let response = await addContact(req.body);
        if (response.success == true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    });

/**
 * @openapi
 * /contacts/{id}:
 *   get:
 *     description: Get a contact by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns the specific contact
 *       '404':
 *         description: Contact not found
 *   put:
 *     description: Update a contact by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contact updated
 *       '404':
 *         description: Contact not found
 *   delete:
 *     description: Delete a contact by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contact deleted
 *       '404':
 *         description: Contact not found
 */
router.route('/contacts/:id')
    .get(async (req, res) => {
        let response = await getContactById(req.params.id);
        if (response.success == true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    })
    .put(async (req, res) => {
        const {name, age} = req.body;
        let response = await updateContact(req.params.id, name, age);
        if (response.success == true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    })
    .delete(async (req, res) => {
        let response = await removeContact(req.params.id);
        if (response.success == true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    });

export default router;
    