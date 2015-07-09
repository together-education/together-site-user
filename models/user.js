var mongodb = require('./mongodb');

var userSchema = new mongodb.mongoose.Schema({
    name: String,
    password: String
}, {
    collection: 'users'
});//users����

var userModel = mongodb.mongoose.model('User', userSchema);

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password
    }
    var newUser = new userModel(user);

    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};//����

User.get = function (name, callback) {
    userModel.findOne({name: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}//��ѯ

module.exports = User;