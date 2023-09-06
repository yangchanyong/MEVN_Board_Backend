const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Account = new mongoose.Schema({
    username : {type:String, unique:true, required: true},
    pw : {type:String, required: true},
    nickName : {type:String, required: true},
    regDate: {type:Date, default:Date.now()},
    updateDate:{type:Date, default: Date.now()}
});

Account.methods.hashPassword = async function() {
    try {
        const salt = await bcrypt.genSalt(10);
        this.pw = await bcrypt.hash(this.pw, salt);
    }catch (err) {
        throw err;
    }
}

Account.statics.create = function(payload) {
    const member = new this(payload);
    member.hashPassword();
    return member.save();
};

Account.statics.findAll = function() {
    return this.find({});
};

Account.statics.updateByMember = function(username, payload) {
    return this.findOneAndUpdate({username}, payload);
};

Account.statics.deleteByMember = function(username) {
    return this.deleteOne({username});
}

module.exports = mongoose.model("Member", Account);