import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//user enters a plain text password which is compared to the encrypted password, and then we need to use decrypt.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); //we compare entered password to the password for the particular user. We call the matchPassword on the specific user which gives us access to their fields.
};

//we are adding middleware here.
//before we actually save the new yser we are going to run this function. We do it using .pre
//Here we are using it to encrypt a password set by the new user creating their profile. We use salt to hash the password.
//This is part of mongoose and for some reason the commands are in ""
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //this is another mongoose function which checks if something has been modified
    next(); //if it has not been modified we will call next and move on.
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
