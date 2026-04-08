// client-admin/src/components/CustomerComponent.js

import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  statusClass(status) {
    if (status === 'APPROVED') return 'badge-approved';
    if (status === 'CANCELED') return 'badge-canceled';
    return 'badge-pending';
  }

  statusLabel(status) {
    if (status === 'APPROVED') return '✅ Đã duyệt';
    if (status === 'CANCELED') return '❌ Đã hủy';
    return '⏳ Chờ duyệt';
  }

  render() {
    const customers = this.state.customers.map((item) => (
      <tr
        key={item._id}
        onClick={() => this.trCustomerClick(item)}
        style={{ cursor: 'pointer' }}
      >
        <td style={{ fontSize: '12px', color: '#999' }}>{item._id}</td>
        <td style={{ fontWeight: '700' }}>{item.username}</td>
        <td style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
          {'*'.repeat((item.password || '').length)}
        </td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>
          <span className={`badge ${item.active === 1 ? 'badge-approved' : 'badge-pending'}`}>
            {item.active === 1 ? 'Đã kích hoạt' : ' Chờ xác minh'}
          </span>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          {item.active === 1 ? (
            <button
              type="button"
              className="btn-admin btn-admin-danger"
              onClick={() => this.lnkDeactiveClick(item)}
            >
              Vô hiệu hóa
            </button>
          ) : (
            <button
              type="button"
              className="btn-admin btn-admin-primary"
              onClick={() => this.lnkEmailClick(item)}
            >
              Gửi mail kích hoạt
            </button>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr
        key={item._id}
        onClick={() => this.trOrderClick(item)}
        style={{
          cursor: 'pointer',
          background: this.state.order?._id === item._id ? '#fff8f0' : undefined
        }}
      >
        <td style={{ fontSize: '12px', color: '#999' }}>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
        <td style={{ fontWeight: '700' }}>{item.customer.name}</td>
        <td>{item.customer.phone}</td>
        <td style={{ color: 'var(--color-primary)', fontWeight: '800', textAlign: 'right' }}>
          {item.total.toLocaleString('vi-VN')} VNĐ
        </td>
        <td>
          <span className={`badge ${this.statusClass(item.status)}`}>
            {this.statusLabel(item.status)}
          </span>
        </td>
      </tr>
    ));

    const items = this.state.order?.items?.map((item, index) => (
      <tr key={item.product._id || index}>
        <td>{index + 1}</td>
        <td style={{ fontSize: '11px', color: '#999' }}>{item.product._id}</td>
        <td style={{ fontWeight: '700' }}>{item.product.name}</td>
        <td>
          <span className="badge badge-brand">{item.product.brand || '---'}</span>
        </td>
        <td>
          <img
            src={'data:image/jpg;base64,' + item.product.image}
            width="80"
            height="60"
            alt={item.product.name}
            style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
          />
        </td>
        <td style={{ color: 'var(--color-primary)', textAlign: 'right' }}>
          {item.product.price.toLocaleString('vi-VN')} VNĐ
        </td>
        <td style={{ textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
        <td style={{ color: 'var(--color-primary)', fontWeight: '800', textAlign: 'right' }}>
          {(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ
        </td>
      </tr>
    )) || [];

    const activeCount = this.state.customers.filter((c) => c.active === 1).length;

    return (
      <main className="admin-page">
        <div className="admin-page-hero">
          <h2> Khách hàng & giao dịch</h2>
          <p>Chọn khách để xem lịch sử đơn hàng.</p>
        </div>

        <div className="admin-customer-stats">
          <div className="admin-customer-stat-card">
            <small>Tổng khách hàng</small>
            <div className="stat-num">{this.state.customers.length}</div>
          </div>
          <div className="admin-customer-stat-card admin-customer-stat-card--ok">
            <small>Đã kích hoạt</small>
            <div className="stat-num">{activeCount}</div>
          </div>
        </div>

        <h4 className="admin-section-title"> Danh sách tài khoản</h4>
        {this.state.customers.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="datatable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>{customers}</tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-box">Chưa có dữ liệu khách hàng</div>
        )}

        {this.state.orders.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: '36px' }}>
               Lịch sử mua xe
            </h3>
            <div className="admin-table-wrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Người mua</th>
                    <th>SĐT</th>
                    <th>Tổng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          </>
        )}

        {this.state.order && (
          <div className="admin-order-detail">
            <div className="admin-order-detail-head">
              <h3> Chi tiết đơn #{this.state.order._id}</h3>
              <button
                type="button"
                className="btn-admin-close"
                onClick={() => this.setState({ order: null })}
              >
                Đóng
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã xe</th>
                    <th>Tên xe</th>
                    <th>Hãng</th>
                    <th>Ảnh</th>
                    <th>Đơn giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items}
                  <tr style={{ background: '#fff8f0' }}>
                    <td colSpan="6" style={{ textAlign: 'right', fontWeight: '700' }}>
                      Tổng cộng:
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '800' }}>
                      {this.state.order.items.reduce((s, i) => s + i.quantity, 0)} xe
                    </td>
                    <td style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '17px', textAlign: 'right' }}>
                      {this.state.order.total.toLocaleString('vi-VN')} VNĐ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    if (window.confirm(`Vô hiệu hóa tài khoản "${item.username}"?`)) {
      this.apiPutCustomerDeactive(item._id, item.token);
    }
  }

  lnkEmailClick(item) {
    if (window.confirm(`Gửi email kích hoạt đến "${item.email}"?`)) {
      this.apiGetCustomerSendmail(item._id);
    }
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) {
        alert('Đã vô hiệu hóa tài khoản!');
        this.apiGetCustomers();
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message);
    });
  }
}

export default Customer;
