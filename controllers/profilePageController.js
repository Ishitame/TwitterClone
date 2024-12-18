const userModel = require("../models/userModel");

module.exports.mainprofilePageController=async (req,res)=>{
   const username=req.params.users;
    let user= req.user
    const friends=user.following
   const done=user.sent
    const sents=user.requests
    let followers=user.followers.length;
    let following=friends.length;
    let request=await userModel.find({username:{$ne:user.username},_id:{$in:sents}});
    let people=await userModel.find({username:{$ne:user.username},_id:{$nin:friends},_id:{$nin:sents},_id:{$nin:done}});
    res.render("Profile",{user,people,request,followers,following})
}

module.exports.followprofilePageController=async (req,res)=>{
    try {
        const senderId = req.user._id; // Logged-in user ID
        const receiverId=req.params.users;
        let receiver=await userModel.findOne({username:receiverId})
        const targetUserId = receiver._id;
    
        // Check if target user exists
        const targetUser = await userModel.findById(targetUserId);
        if (!targetUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        // Check if the users are already friends
        const alreadyFriends = await userModel.findOne({
          _id: senderId,
          following: { $in: [targetUserId] }
        });
    
        if (alreadyFriends) {
          return res.status(400).json({ success: false});
        }
    
        // Add friend request logic here (you might add it to a "friendRequests" array or similar)
        // For example, adding the target user to the sender's "friendRequests" array
        await userModel.findByIdAndUpdate(senderId , { $push: { sent:targetUserId} });
        await userModel.findByIdAndUpdate(targetUserId, { $push: { requests: senderId } });
    
        // Respond with success
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error processing friend request:', error);
        res.status(500).json({ success: false});
      }
    }

module.exports.acceptprofilePageController=async(req,res)=>{
  try {
    const userId = req.user._id; // Logged-in user's ID
    const target = req.params.users;
    let targets=await userModel.findOne({username:target});
    const targetUserId=targets._id;
  
    // Find the logged-in user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false });
    }
    

    

    // Move the target user from friendRequests to friends
    user.requests = user.requests.filter(_id => _id.toString() !== targetUserId.toString());
     // Remove the request
     targets.sent = targets.sent.filter(_id => _id.toString() !== userId.toString());
    user.followers.push(targetUserId); // Add to friends list

    // Update the target user's friends array
    await userModel.findByIdAndUpdate(targetUserId, { $push: { following: userId },$pull:{sent:userId}
     });

    await user.save(); // Save the updated user
  

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports.declineprofilePageController=async(req,res)=>{
  try {
    const receiverId = req.user._id; // Logged-in user
    const senderId = req.params.users;
    let sender=await userModel.findOne({username:senderId});

    const receiver = await userModel.findById(receiverId);

    if (!receiver) {
      return res.status(404).send('User not found');
    }

    // Remove the sender from the receiver's friendRequests array
    receiver.requests = receiver.requests.filter(
      (_id) => _id.toString() !== sender._id.toString()
    );

    sender.sent = sender.sent.filter(
      (_id) => _id.toString() !== receiver._id.toString()
    );
    await sender.save();

    await receiver.save();

    res.status(200).send('Friend request declined successfully');
  } catch (error) {
    res.status(500).send('Error declining friend request');
  }
};
    
    


