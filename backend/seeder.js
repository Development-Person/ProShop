/*WARNING RUNNING THIS SCRIPT WILL WIPE THE DATABASE*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

/*The part from createdUsers down to the await is being done so that the adminuser is the id for the products being sent to the database. 
    This is specific to this example and should not necessarily be used in the future. 
    However, it is a good example of how you might apend data to a data set you are sending to a database.
    1. createdUser returns an array
    2. adminUser is the first user in the users file (which is the admin in this case), and we want their _id
    3. then we attach that _id as the user id for each sample product.
    4. sampleProducts is taking all the data already there (using the spread operator ...) and adding to the user field the adminUser */

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

/*you run the npm script "node backend/seeder" to import the data, if you append -d to the command it will destory the data.
process.argv allows you to do this and [2] is equal to the appended character
to make this easier we have added the following scripts to the root package.json folder: 
    "data:import": "node backend/seeder",
    "data:destroy": "node backend/seeder -d"
so you just have to right npm run data:import or npm run data:destroy and it will run the command for you*/
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
