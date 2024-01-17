import { Router } from 'express';
import { body, param, query } from 'express-validator';

import {usersGet, usersPost, usersPut, usersPatch, usersDelete} from '../controllers/users.controllers.js'
import { validateFields } from '../middlewares/validation-fields.js';
import { emailExist, isRoleValid, idExist} from '../helpers/db-validators.js';
import { jwtValidation } from '../middlewares/validation-jwt.js';
import { hasRole, isAdminRole } from '../middlewares/validation-role.js';

const routes = Router();

routes.get('/',[
    query("limit", "El valor de 'limite' debe ser numérico")
    .isNumeric()
    .optional(),
    query("from", "El valor de 'desde' debe ser numérico")
    .isNumeric()
    .optional(),
    validateFields,
], usersGet);

routes.post('/',[
    body('name', 'El Nombre es obligatorio').not().isEmpty(),
    body('email', 'El Email no es válido').isEmail(),
    body('email').custom(emailExist),
    body('password', 'El Password es obligatorio y debe tener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula y un número')
        .isLength({min:8}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
    body('role').custom(isRoleValid),
    validateFields
], usersPost);

routes.put('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(idExist),
    body('role').custom(isRoleValid),
    validateFields
], usersPut);

routes.patch('/', usersPatch);

routes.delete('/:id',[
    jwtValidation,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    param('id', 'No es ,un ID válido').isMongoId(),
    param('id').custom(idExist),
    validateFields,
], usersDelete);

export default routes;
