import { Router } from 'express';
import {
  createContactController,
  delateContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  // upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

// router.put('/contacts/:contactId', ctrlWrapper(upsertContactController));

router.delete('/contacts/:contactId', ctrlWrapper(delateContactController));

export default router;
