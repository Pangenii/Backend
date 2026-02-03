import mongoose from 'mongoose';
import argon2 from "argon2";

//AS OF NOW, MODEL INCLUDES USERNAME, EMAIL, PASSWORD, CREATEDAT
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

//MONGOOSE PRESAVE HOOK(MIDDLEWARE)
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await argon2.hash(this.password);
        } catch (error) {
            return next(error);
        }
    }
})

//COMPARE PASSWORD METHOD, USED WHILE CREATING ACCOUNT OR UPDATING PASSWORD
userSchema.methods.comparePassword = async function (userPassword) {
    try {
        return await argon2.verify(this.password, userPassword);
    } catch (error) {
        throw error;
    }
}


const User = mongoose.model("User", userSchema);
module.exports = User;