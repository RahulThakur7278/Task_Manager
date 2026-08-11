import express from 'express';
import { getUsers, addMember, addMemberSchema } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { updateMember } from '../controllers/userController.js';
const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.route('/')
  .get(getUsers)
  .post(validate(addMemberSchema), addMember);

router.patch('/updates/:id', updateMember);

export default router;
