import { isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import Contact from '../models/contactModel.js';

// Get all contacts
export async function getAllContacts() {
    let total = await Contact.countDocuments({});
    let limit = parseInt(total);

    try {
        const contacts = await Contact.find().limit(limit);
        return {
            success: true,
            data: contacts,
            total: total.toString(),
        }
    } catch (err) {
        return { success: false, message: "Contacts not found " + err };
    }
}

// Get contact by Id
export async function getContactById(id) {
  if (!isValidObjectId(id)) {
    return { success: false, message: "Contact not found " };
  }
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return { success: false, message: "Contact not found" };
    }
    return {
        success: true,
        data: contact,
    }
  } catch (err) {
    return { success: false, message: "Contact not found " + err };
  }
}

// Add a new contact, returns the added contact
export async function addContact(body) {
  try {
    const newContact = new Contact(body);
    const savedContact = await newContact.save();
    return {
        success: true,
        data: savedContact
    };
  } catch (err) {
    return { success: false, message: "Failed to add contact: " + err };
  }
}
 
// Update an existing contact
export async function updateContact(id, name = null, age = null) {
   if (!isValidObjectId(id)) {
    return { success: false, message: "Invalid ID format" };
  }
  
  try {
    const updateFields = {};
    if (name !== null) updateFields.name = name;
    if (age !== null) updateFields.age = age;

    // { new: true } permet de renvoyer le document mis à jour plutôt que l'ancien
    const updatedContact = await Contact.findByIdAndUpdate(id, updateFields, { new: true });
    
    if (!updatedContact) {
        return { success: false, message: "Contact not found" };
    }
    
    return {
        success: true,
        data: updatedContact
    };
  } catch (err) {
    return { success: false, message: "Failed to update contact: " + err };
  }
}
    
// Remove an existing contact
export async function removeContact(id) {
  if (!isValidObjectId(id)) {
    return { success: false, message: "Invalid ID format" };
  }

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
        return { success: false, message: "Contact not found" };
    }
    
    return {
        success: true,
        data: deletedContact
    };
  } catch (err) {
    return { success: false, message: "Failed to remove contact: " + err };
  }
}
