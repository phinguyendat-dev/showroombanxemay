// client-customer/src/components/MyordersComponent.js

import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { orders: [], order: null };
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

  typeClass(type) {
    if (type === 'Xe số')      return 'badge-type-so';
    if (type === 'Xe ga')      return 'badge-type-ga';
    if (type === 'Xe côn tay') return 'badge-type-con';
    if (type === 'Xe điện')    return 'badge-type-dien';
    return 'badge-type-default';
  }

  render() {
    if (this.context.token === '')
      return <Navigate replace to='/login' />;

    const { orders, order } = this.state;

    return (
      <main className="customer-page">

        <div className="page-hero page-hero-orders">
          <h1 className="page-hero-title">Đơn hàng của tôi</h1>
          <p className="page-hero-sub">Theo dõi trạng thái và chi tiết từng đơn đặt xe.</p>
        </div>

        {/* DANH SÁCH ĐƠN */}
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <p>Bạn chưa có đơn hàng nào!</p>
            <p style={{ fontSize: '13px', color: '#aaa' }}>
              Hãy chọn xe và đặt hàng ngay.
            </p>
            <a href="/home">
              <button className="btn-red" style={{ marginTop: '16px' }}>
                🏍️ Mua xe ngay
              </button>
            </a>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Thời gian đặt</th>
                  <th>Tên khách</th>
                  <th>Số điện thoại</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(item => (
                  <tr
                    key={item._id}
                    onClick={() => this.trItemClick(item)}
                    style={{
                      cursor: 'pointer',
                      background: order?._id === item._id ? '#fff8f0' : 'white'
                    }}
                  >
                    <td style={{ fontSize: '11px', color: '#999' }}>{item._id}</td>
                    <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
                    <td style={{ fontWeight: '700' }}>{item.customer.name}</td>
                    <td>{item.customer.phone}</td>
                    <td style={{ color: '#c0392b', fontWeight: '800' }}>
                      {item.total.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td>
                      <span className={`badge ${this.statusClass(item.status)}`}>
                        {this.statusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CHI TIẾT ĐƠN HÀNG */}
        {order && (
          <div style={{ marginTop: '30px' }}>

            {/* HEADER */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px',
              borderLeft: '4px solid #c0392b'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#c0392b' }}>
                   Chi tiết đơn hàng
                </h3>
                <p style={{ margin: '3px 0', fontSize: '13px', color: '#777' }}>
                  Mã đơn: <b style={{ color: '#1a1a2e' }}>{order._id}</b>
                </p>
                <p style={{ margin: '3px 0', fontSize: '13px', color: '#777' }}>
                  Ngày đặt: <b style={{ color: '#1a1a2e' }}>
                    {new Date(order.cdate).toLocaleString('vi-VN')}
                  </b>
                </p>
                <p style={{ margin: '3px 0', fontSize: '13px', color: '#777' }}>
                  Khách hàng: <b style={{ color: '#1a1a2e' }}>{order.customer.name}</b>
                  {' — '}
                  SĐT: <b style={{ color: '#1a1a2e' }}>{order.customer.phone}</b>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${this.statusClass(order.status)}`}
                  style={{ fontSize: '13px', padding: '6px 16px' }}>
                  {this.statusLabel(order.status)}
                </span>
                <p style={{ margin: '10px 0 0', fontSize: '22px', fontWeight: '800', color: '#c0392b' }}>
                  {order.total.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>

            {/* BẢNG SẢN PHẨM */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ảnh</th>
                    <th>Tên xe</th>
                    <th>Hãng</th>
                    <th>Loại xe</th>
                    <th>Đơn giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.product._id}>
                      <td style={{ textAlign: 'center', color: '#888' }}>{index + 1}</td>
                      <td>
                        <img
                          src={"data:image/jpg;base64," + item.product.image}
                          width="80" height="65"
                          alt={item.product.name}
                          style={{ borderRadius: '6px', objectFit: 'cover' }}
                        />
                      </td>
                      <td style={{ fontWeight: '700', color: '#1a1a2e' }}>
                        {item.product.name}
                      </td>
                      <td>
                        <span className="badge badge-brand">
                          {item.product.brand || '---'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${this.typeClass(item.product.type)}`}>
                          {item.product.type || '---'}
                        </span>
                      </td>
                      <td style={{ color: '#c0392b', fontWeight: '700' }}>
                        {item.product.price.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700' }}>
                        {item.quantity}
                      </td>
                      <td style={{ color: '#c0392b', fontWeight: '800' }}>
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </td>
                    </tr>
                  ))}

                  {/* TỔNG */}
                  <tr style={{ background: '#fff8f0' }}>
                    <td colSpan="6" style={{ textAlign: 'right', fontWeight: '700', color: '#555' }}>
                      Tổng cộng:
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '800' }}>
                      {order.items.reduce((s, i) => s + i.quantity, 0)} xe
                    </td>
                    <td style={{ color: '#c0392b', fontWeight: '800', fontSize: '16px' }}>
                      {order.total.toLocaleString('vi-VN')} VNĐ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* THÔNG BÁO TRẠNG THÁI */}
            {order.status === 'PENDING' && (
              <div className="info-box info-box-yellow" style={{ marginTop: '14px' }}>
                 Đơn hàng đang chờ xác nhận. Chúng tôi sẽ liên hệ bạn sớm nhất!
              </div>
            )}
            {order.status === 'APPROVED' && (
              <div className="info-box info-box-green" style={{ marginTop: '14px' }}>
                 Đơn hàng đã được duyệt! Xe sẽ được giao trong <b>24 giờ</b>.
              </div>
            )}
            {order.status === 'CANCELED' && (
              <div className="info-box info-box-red" style={{ marginTop: '14px' }}>
                 Đơn hàng đã bị hủy. Liên hệ hotline{' '}
                <b style={{ color: '#c0392b' }}>1800 1234</b> để biết thêm chi tiết.
              </div>
            )}

          </div>
        )}

      </main>
    );
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  componentDidMount() {
    if (this.context.customer) {
      const config = { headers: { 'x-access-token': this.context.token } };
      axios.get('/api/customer/orders/customer/' + this.context.customer._id, config)
        .then(res => this.setState({ orders: res.data }));
    }
  }
}

export default Myorders;