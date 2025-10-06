import { Router } from 'express';
import { createUser, deleteUser, getUser, listUsers, updateUser } from './../controller/user.ctl.js';


const router = Router();


router.get('/list', listUsers); // GET /api/users
router.get('/:id', getUser); // GET /api/users/:id
router.post('/create', createUser); // POST /api/users
router.patch('/:id', updateUser); // PATCH /api/users/:id
router.delete('/:id', deleteUser); // DELETE /api/users/:id


export default router;