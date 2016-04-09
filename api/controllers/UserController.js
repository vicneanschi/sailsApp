/**
 * UserController
 * @description :: Server-side logic for manage users
 */

module.exports = {
  me: function (req, res) {
    if (!req.user || ! req.user.id) return res.badRequest();
    
    User.findOne(req.user.id)
      .exec(function (err, user) {
        if (err) return res.serverError(err);

        res.ok(user);
      });
  }
};
