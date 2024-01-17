import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { generationJWT } from '../helpers/generation-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

const authPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Verify if email exist
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: 'User / Password no son corectos - email',
      });
    }

    //Verify if user is active
    if (!user.state) {
      return res.status(400).json({
        msg: 'User / Password no son correctos - estado: false',
      });
    }

    //Verify password
    const valisPassword = bcrypt.compareSync(password, user.password);

    if (!valisPassword) {
      return res.status(400).json({
        msg: 'User / Password no son corectos - password',
      });
    }

    //Generate the JWT
    const token = await generationJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      //Must be created
      const data = {
        name,
        email,
        password: '',
        img,
        role: 'ADMIN_ROLE',
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    //If user in DB is false
    if (!user.state) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    //Generate the JWT
    const token = await generationJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'El Token no se pudo verificar',
    });
  }
};

export { authPost, googleSignIn };
