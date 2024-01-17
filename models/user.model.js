import { Schema, model } from 'mongoose';

const UserSchema = Schema({
  name: {
    type: String,
    require: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    require: [true, 'El Correo es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'La contraseña es obligatorio'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    require: true,
    default: "USER_ROLE"
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: String,
    default: false,
  },
});

UserSchema.methods.toJSON = function(){
  const {__v, password, _id, ...user} = this.toObject();
  user.uid = _id;
  return user;
}

export default model('User', UserSchema);