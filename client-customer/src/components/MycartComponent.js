import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const { mycart } = this.context;

    return (
      <main className="customer-page">

        <div className="page-hero page-hero-cart">
          <h1 className="page-hero-title">Giỏ hàng của bạn</h1>
          <p className="page-hero-sub">Kiểm tra xe đã chọn và hoàn tất đặt hàng khi sẵn sàng.</p>
        </div>

        {mycart.length === 0 ? (
          // TRỐNG
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p>Giỏ hàng của bạn đang trống!</p>
            <p style={{ fontSize: '13px', color: '#aaa' }}>
              Hãy chọn xe bạn yêu thích để thêm vào giỏ hàng.
            </p>
            <a href="/home">
              <button className="btn-red" style={{ marginTop: '16px' }}>
                 Về trang chủ
              </button>
            </a>
          </div>
        ) : (
          <div>
            {/* BẢNG GIỎ HÀNG */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Xe</th>
                    <th>Tên xe</th>
                    <th>Hãng</th>
                    <th>Loại</th>
                    <th>Đơn giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mycart.map((item, index) => (
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
                        {item.product.brand
                          ? <span className="badge badge-brand">{item.product.brand}</span>
                          : '---'}
                      </td>
                      <td>
                        {item.product.type
                          ? <span className={`badge ${this.typeClass(item.product.type)}`}>
                              {item.product.type}
                            </span>
                          : '---'}
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
                      <td>
                        <button
                          onClick={() => this.lnkRemoveClick(item.product._id)}
                          style={{
                            background: 'none',
                            border: '1px solid #e74c3c',
                            color: '#e74c3c',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TỔNG TIỀN + THANH TOÁN */}
            <div style={{
              marginTop: '20px',
              background: 'white',
              borderRadius: '12px',
              padding: '20px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <p style={{ color: '#888', fontSize: '14px', margin: '0 0 4px' }}>
                  Tổng số xe: <b style={{ color: '#1a1a2e' }}>
                    {mycart.reduce((s, i) => s + i.quantity, 0)} xe
                  </b>
                </p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#c0392b', margin: 0 }}>
                  Tổng cộng: {CartUtil.getTotal(mycart).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <button className="btn-checkout" onClick={() => this.lnkCheckoutClick()}>
                ĐẶT HÀNG NGAY
              </button>
            </div>

            <ul className="cart-trust-badges" aria-label="Cam kết dịch vụ">
              <li>
                <span className="cart-trust-icon" aria-hidden="true"></span>
                <span>Giao xe trong <strong>24 giờ</strong></span>
              </li>
              <li>
                <span className="cart-trust-icon" aria-hidden="true"></span>
                <span>Đổi trả <strong>7 ngày</strong> nếu lỗi NSX</span>
              </li>
              <li>
                <span className="cart-trust-icon" aria-hidden="true">📞</span>
                <span>Hotline <strong className="cart-trust-hotline">1800 1234</strong></span>
              </li>
            </ul>
          </div>
        )}
      </main>
    );
  }

  typeClass(type) {
    if (type === 'Xe số')       return 'badge-type-so';
    if (type === 'Xe ga')       return 'badge-type-ga';
    if (type === 'Xe côn tay')  return 'badge-type-con';
    if (type === 'Xe điện')     return 'badge-type-dien';
    return 'badge-type-default';
  }

  lnkRemoveClick(id) {
    if (window.confirm('Xóa xe này khỏi giỏ hàng?')) {
      const mycart = [...this.context.mycart];
      const index  = mycart.findIndex(x => x.product._id === id);
      if (index !== -1) {
        mycart.splice(index, 1);
        this.context.setMycart(mycart);
      }
    }
  }

  lnkCheckoutClick() {
    if (!window.confirm('Xác nhận đặt hàng?')) return;

    const { mycart, customer, token } = this.context;

    if (mycart.length === 0) {
      alert('Giỏ hàng đang trống!');
      return;
    }

    if (!customer) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      this.props.navigate('/login');
      return;
    }

    const total = CartUtil.getTotal(mycart);
    const body  = { total, items: mycart, customer };
    const config = { headers: { 'x-access-token': token } };

    axios.post('/api/customer/checkout', body, config).then((res) => {
      if (res.data) {
        alert(' Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm nhất.');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Đặt hàng thất bại! Vui lòng thử lại.');
      }
    });
  }
}

export default withRouter(Mycart);