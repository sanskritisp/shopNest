import mongoose from "mongoose"

const connect = async() => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/shopNest`)
        console.log("mongo is connected")
    } catch (error) {
        console.log("Error at connecting to mongo db --> ", error)
    }
}
export default connect