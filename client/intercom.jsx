IntercomSettings.userInfo = function(user, info) {
  info.email = userEmail(user._id),
  info['name'] = userName(user._id)
}
