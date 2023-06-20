import mongoose from "mongoose";

const connect = () => {
  const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(process.env.MONGODB_URI,connectionParams)
.then( () => {
    console.log('Connected to the database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. n${err}`);
})
};

export default connect;