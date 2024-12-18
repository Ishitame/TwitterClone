const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String},
  email: { type: String},
  password: { type: String},
//   profilePicture: { type: String, default: "" },
//   bio: { type: String, maxlength: 160, default: "" },
//   location: { type: String, maxlength: 30, default: "" },
//   website: { type: String, default: "" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  
//   likedTweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }], // Tweets liked by the user
//   retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }], // Tweets retweeted by the user
//   createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);