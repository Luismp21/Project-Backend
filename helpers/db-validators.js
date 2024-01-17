import Role from '../models/role.model.js';
import User from '../models/user.model.js';

const isRoleValid = async (rol = '') => {
  const rolExist = await Role.findOne({ rol });
  if (!rolExist) {
    throw new Error(`El rol ${rol} no está registrado en la Base de Datos`);
  }
};

const emailExist = async (email = '') => {
  //Check if the email exist
  const checkEmailExist = await User.findOne({ email });
  if (checkEmailExist) {
    throw new Error(`El correo ${email} ya se encuentra registrado`);
  }
};

const idExist = async (id = '') => {
    //Check if the id exist
    const checkIdExist = await User.findById(id);
    if (!checkIdExist) {
      throw new Error(`El ID ${id} no existe`);
    }
  };

export { isRoleValid, emailExist, idExist };
