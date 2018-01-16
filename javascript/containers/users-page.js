import React from 'react'
import { connect } from 'react-redux'

import { getUsers } from 'store/user'

export class UsersPage extends React.Component {
  componentDidMount = () => {
    this.props.getUsers()
  }

  changeAccess = (user, dbName) => {
    console.log(user, dbName)
  }

  render () {
    const { loading, users } = this.props
    if (this.props.loading) return (<div className='loader' />)
    return (
      <div className='users-page'>
        <div className='pull-right'>
          <a href='#/admin/newuser' >Create New User</a>
        </div>
        <h5>Users and Access</h5>
        <table className='no-hover'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Access Databases (blue means user has access)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              return (
                <tr key={i}>
                  <td>{user.name} <a href='#'>Edit Password</a></td>
                  <td>
                    {user.databases.map((db, j) => {
                      let classes = 'button-small'
                      if (db.hasAccess) classes += ' button-primary'
                      return (
                        <button
                          key={j}
                          onClick={(e) => this.changeAccess(user.doc, db.dbName)}
                          className={classes}
                        >
                          {db.name}
                        </button>
                      )
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(
  state => state.user,
  { getUsers }
)(UsersPage)
