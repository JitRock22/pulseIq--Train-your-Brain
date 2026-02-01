const mongoose=require('mongoose');

const dbConnection=async()=>{
    try{
        const connect=await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Database Connected : ${connect.connection.host} & ${connect.connection.name}`);
    }catch(e){
        console.log(e);
        process.exit(1);
    }
};

module.exports=dbConnection;