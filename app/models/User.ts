import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
 email: string;
 password: string;
 role: "user" | "admin";
 createdAt: Date;
 comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
 email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  trim: true,
  lowercase: true,
 },
 password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [6, "Password must be at least 6 characters"],
 },
 role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
 },
 createdAt: {
  type: Date,
  default: Date.now,
 },
});

UserSchema.pre("save", async function (next) {
 if (!this.isModified("password")) return next();

 try {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
 } catch (error) {
  next(error as Error);
 }
});

UserSchema.methods.comparePassword = async function (
 candidatePassword: string
): Promise<boolean> {
 return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User ||
 mongoose.model<IUser>("User", UserSchema);
