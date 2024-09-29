import { Router } from 'express';
import {
  createContactController,
  delateContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  patchContactsSchema,
} from '../validation/contacts.js';
import { isValidId } from '../validation/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/contacts',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(patchContactsSchema),
  ctrlWrapper(patchContactController),
);

router.put(
  '/contacts/:contactId',
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(upsertContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(delateContactController),
);

export default router;
