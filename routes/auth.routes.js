import { Router } from 'express';
import { body } from 'express-validator';

import { authPost, googleSignIn } from '../controllers/auth.controllers.js';
import { validateFields } from '../middlewares/validation-fields.js';


const routes = Router();

routes.post('/login',[
    body('email', 'El email es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], authPost)

routes.post('/google',[
    body('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignIn)


export default routes;