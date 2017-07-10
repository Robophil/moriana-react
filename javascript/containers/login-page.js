import React from 'react'
import { connect } from 'react-redux'
import { login } from 'user'

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
      <div className="login">
        <h5 className="text-capitalize header">Login</h5>
        <hr />
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          <fieldset>
            <div className='form-group'>
              <label className="col-lg-2 control-label">Username</label>
              <div className="col-sm-9 input-group">
                <input className="form-control" type="text" ref='username' autoFocus />
                <p className="help-block error hide-lite">Username required</p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-lg-2 control-label">Password</label>
              <div className="col-sm-9 input-group">
                <input className="form-control" type="password" ref='password' />
              </div>
            </div>
          </fieldset>
          <div className="text-center">
            <button type='submit' className="btn btn-primary submit">Submit</button>
          </div>
        </form>
        <br />
        {this.props.authError && (
          <div className="alert alert-danger center-block text-center">Incorrect username or password.</div>
        )}
      </div>
    )
  }
}

export default connect(
  state => state.user,
  { login }
)(LoginPage)
