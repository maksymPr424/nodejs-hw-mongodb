import createHttpError from 'http-errors';
import {
  createContact,
  delateContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  if (!contacts) throw createHttpError(404, 'Contacts not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

// export const upsertContactController = async (req, res, next) => {
//   const { contactId } = req.params;

//   const result = await updateContact(contactId, req.body, {
//     upsert: true,
//   });

//   if (!result) {
//     next(createHttpError(404, 'Contact not found'));
//     return;
//   }

//   const status = result.isNew ? 201 : 200;

//   res.status(status).json({
//     status,
//     message: 'Successfully upserted a contact!',
//     data: result.contact,
//   });
// };

export const delateContactController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await delateContact(contactId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
