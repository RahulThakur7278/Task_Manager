import express from 'express';
import { getUsers, addMember, addMemberSchema, updateMember, getUserDashboard ,getTask} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();
// All user routes require authentication
router.use(authMiddleware);

router.get('/dashboard', getUserDashboard);
router.get('/get-task', getTask);

router.route('/')
  .get(getUsers)
  .post(validate(addMemberSchema), addMember);

router.patch('/updates/:id', updateMember);

export default router;
