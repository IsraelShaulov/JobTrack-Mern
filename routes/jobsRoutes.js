import express from 'express';
const router = express.Router();
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobsController.js';
import testUser from '../middleware/testUser.js';

router.route('/').post(testUser, createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').patch(testUser, updateJob).delete(testUser, deleteJob);

export default router;
