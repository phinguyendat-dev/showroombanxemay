// client-admin/src/components/LoginComponent.js

import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <div className="login-admin-root">
          <div className="login-admin-card">
            <div className="login-admin-banner">
              <h1>🏍️ Moto Shop</h1>
              <p>Hệ thống quản trị cửa hàng</p>
            </div>
            <div className="login-admin-body">
              <h3>Đăng nhập admin</h3>
              <form onSubmit={(e) => this.btnLoginClick(e)}>
                <div className="login-admin-field">
                  <label htmlFor="admin-user">Tên đăng nhập</label>
                  <input
                    id="admin-user"
                    type="text"
                    placeholder="Nhập username..."
                    autoComplete="username"
                    value={this.state.txtUsername}
                    onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  />
                </div>
                <div className="login-admin-field">
                  <label htmlFor="admin-pass">Mật khẩu</label>
                  <input
                    id="admin-pass"
                    type="password"
                    placeholder="Nhập password..."
                    autoComplete="current-password"
                    value={this.state.txtPassword}
                    onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  />
                </div>
                <button type="submit" className="login-admin-submit">
                  Đăng nhập ngay
                </button>
              </form>
              <p className="login-admin-footer">
                © 2026 Moto Shop Admin Panel
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;

    if (txtUsername && txtPassword) {
      this.apiLogin({ username: txtUsername, password: txtPassword });
    } else {
      alert('⚠️ Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
    }
  }

  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert('❌ ' + result.message);
      }
    }).catch(() => {
      alert('❌ Lỗi kết nối đến server. Vui lòng thử lại.');
    });
  }
}

export default Login;
