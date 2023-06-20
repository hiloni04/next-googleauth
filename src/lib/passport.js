import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import User from "../models/User";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const obj = await User.findOne({ email: profile.email }).exec();
        if (!obj) {
          const newUser = new User({
            email: profile.email,
            name: profile.displayName,
            accessToken,
          });
          await newUser.save();
          const token = jwt.sign(
            { id: newUser._id, created: Date.now().toString() },
            process.env.JWT_SECRET
          );
          newUser.tokens.push(token);
          await newUser.save();
          done(null, newUser, { message: "Auth successful", token });
        } else {
          const token = jwt.sign(
            { id: obj._id, created: Date.now().toString() },
            process.env.JWT_SECRET
          );
          obj.tokens.push(token);
          await obj.save();
          done(null, obj, { message: "Auth successful", token });
        }
      } catch (error) {
        console.error(error);
        done(error, false, { message: "Internal Server Error" });
      }
    }
  )
);

// Additional code for serialization and deserialization if required

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;