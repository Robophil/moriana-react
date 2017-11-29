import React from 'react'
import { connect } from 'react-redux'
import { login } from 'store/user'

const LoginPage = class extends React.Component {
  state = {}

  onSubmit = (event) => {
    event.preventDefault()
    this.props.login(this.refs.username.value, this.refs.password.value)
  }

  render () {
    // if (this.props.authenticated) return (<Redirect to='/' />)
    if (this.props.authenticated) {
      window.location.href = '/#/'
    }
    return (
      <div className='login-page'>
        <h1>Login to Moriana</h1>
        <form onSubmit={this.onSubmit}>
          <div>
            {/* <label>Username</label> */}
            <input type='text' placeholder='Username' ref='username' autoFocus />
          </div>
          <div>
            {/* <label>Password</label> */}
            <input type='password' placeholder='Password' ref='password' />
            {this.props.authError && ( <p className='error'>Incorrect username or password.</p> )}
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }
}

export default connect(
  state => state.user,
  { login }
)(LoginPage)
