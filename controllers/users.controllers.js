import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

const usersGet = async (req, res) => {
  const { limit = 5, from = 1 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(from - 1))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPost = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  //Encrypt the password
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  //Save in BD
  await user.save();

  res.json({
    msg: 'Post API',
    user,
  });
};

const usersPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...requestBody } = req.body;

  if (password) {
    //Encrypt the password
    const salt = bcrypt.genSaltSync(10);
    requestBody.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, requestBody, { new: true });

  res.json(user);
};

const usersPatch = (req, res) => {
  res.json({
    msg: 'Patch API',
  });
};

const usersDelete = async(req, res) => {
  
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, {state: false}, { new: true })

  res.json({
    user
  });
};

export { usersGet, usersPost, usersPut, usersPatch, usersDelete };
