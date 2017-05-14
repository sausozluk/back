module.exports = {
  successLogin: function (mdl, count) {
    var user = mdl.toObject();
    var size = user.tokens.length;
    return {
      user_id: user._id,
      token: user.tokens[size - 1],
      email: user.email,
      username: user.username,
      slug: user.slug,
      authority: user.permission,
      unread: count
    };
  }
};