import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

//some fiels are optional cuz only get this field when user created in database
export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Initially, we will hash the password upon user creation. Later, this pre-hook handles hashing whenever the password is updated.
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});

const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;