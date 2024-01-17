import jsw from 'jsonwebtoken';

import User from '../models/user.model.js';

const jwtValidation = async (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }

  try {
    const { uid } = jsw.verify(token, process.env.SECRETORPUBLICKEY);

    //Read the user that corresponds to the uid.
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe en Base de Datos',
      });
    }

    //Check if the uid has state true
    if (!user.state) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado: false',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

export { jwtValidation };
