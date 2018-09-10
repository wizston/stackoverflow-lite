'use strict'

const Hash = use('Hash')
const Model = use('Model')
const md5 = require('blueimp-md5')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get table () {
    return 'users'
  }

  static get primaryKey () {
    return 'id'
  }

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  static get hidden () {
    return ['password']
  }

  static get computed () {
    return ['avatarpath']
  }

  getAvatarpath ({ avatar, email }) {
    if (!avatar) {
      return `http://www.gravatar.com/avatar/${md5(email)}?d=mm&s=60`
    }
    return avatar
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  profile () {
    return this.hasMany('App/Models/UsersProfile', 'id', 'user_id')
  }

  questions () {
    return this.hasMany('App/Models/Question', 'id', 'user_id')
  }

  answers () {
    return this.hasMany('App/Models/Answers', 'id', 'user_id')
  }
}

module.exports = User
