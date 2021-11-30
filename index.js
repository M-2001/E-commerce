const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./middleware/jwt.middleware')
const errorHandler = require('./middleware/error.middleware')

//importaciones de rutas
const productsRoutes = require('./routes/product.routes');
const usersRoutes = require('./routes/users.routes');
const categoriesRoutes = require('./routes/categories.routes');
const ordersRoutes = require('./routes/orders.routes');
const authRoutes = require('./routes/auth.routes');


const api = process.env.API_URL;


//middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

//Routes
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/auth`, authRoutes);

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
}).then(()=>{
    console.log("Database Connection is ready...");
}).catch((error)=>{
    console.log(error);
})
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    
    console.log(`Server is running in port:${PORT}`);
}) 