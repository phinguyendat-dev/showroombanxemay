import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      recentOrders: [],
      hotProducts: [],
      newProducts: []
    };
  }

  render() {
    const renderProducts = (products) => {
      if (!products.length) {
        return <div style={{ textAlign: 'center', color: '#9ca3af', padding: '16px 0' }}>Chua co du lieu san pham.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {products.map((item) => (
            <div key={item._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '14px' }}>
              <img
                src={'data:image/jpg;base64,' + item.image}
                alt={item.name}
                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h4 style={{ margin: '12px 0 6px', fontSize: '15px' }}>{item.name}</h4>
              <p style={{ margin: 0, color: '#c0392b', fontWeight: 700 }}>
                {(item.price || 0).toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          ))}
        </div>
      );
    };

    const recentOrders = this.state.recentOrders.slice(0, 5).map((item) => {
      return (
        <tr key={item._id} className="datatable" style={{ borderBottom: '1px solid #eee' }}>
          <td style={{ fontSize: '11px', color: '#888' }}>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td style={{ fontWeight: 'bold' }}>{item.customer?.name || '---'}</td>
          <td>{item.customer?.phone || '---'}</td>
          <td style={{ color: '#d9534f', fontWeight: 'bold' }}>
            {item.total.toLocaleString('vi-VN')} VNĐ
          </td>
          <td>
            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              background:
                item.status === 'APPROVED' ? '#2ecc71' :
                item.status === 'CANCELED' ? '#e74c3c' : '#f39c12',
              color: 'white'
            }}>
              {item.status === 'APPROVED' ? '✅ ĐÃ DUYỆT' :
               item.status === 'CANCELED' ? '❌ ĐÃ HỦY'  : '⏳ CHỜ DUYỆT'}
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div style={{ 
        padding: '30px', 
        minHeight: '100vh',
        
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), hq720.jpg')`
      }}>

        {/* ===== BANNER CHÍNH ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50, #000000)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }}>
          <h1 style={{ margin: 0, letterSpacing: '4px', fontSize: '36px', textTransform: 'uppercase' }}>MOTOSHOP</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '16px' }}>
            Hệ thống quản lý Showroom — Chào mừng, <b>{this.context.username}</b>!
          </p>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ color: '#333', marginBottom: '14px', borderLeft: '5px solid #d9534f', paddingLeft: '15px', textTransform: 'uppercase', fontSize: '18px' }}>
            SẢN PHẨM NỔI BẬT
          </h3>
          {renderProducts(this.state.hotProducts)}
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ color: '#333', marginBottom: '14px', borderLeft: '5px solid #2c3e50', paddingLeft: '15px', textTransform: 'uppercase', fontSize: '18px' }}>
            SẢN PHẨM MỚI
          </h3>
          {renderProducts(this.state.newProducts)}
        </div>

        {/* ===== ĐƠN HÀNG GẦN ĐÂY ===== */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', // Nền trắng mờ để nổi bật bảng
          padding: '25px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(5px)' // Hiệu ứng mờ nền showroom
        }}>
          <h3 style={{ color: '#333', marginBottom: '25px', borderLeft: '5px solid #d9534f', paddingLeft: '15px', textTransform: 'uppercase', fontSize: '18px' }}>
            🕐 GIAO DỊCH GẦN ĐÂY
          </h3>
          {this.state.recentOrders.length > 0 ? (
            <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr className="datatable" style={{ background: '#f8f9fa' }}>
                  <th>Mã đơn</th>
                  <th>Thời gian</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
                {recentOrders}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>
               Hiện chưa có phát sinh giao dịch mới.
            </div>
          )}
        </div>

        {/* ===== HƯỚNG DẪN NHANH ===== */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(217, 83, 79, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(217, 83, 79, 0.2)',
          color: '#333'
        }}>
          <h4 style={{ margin: '0 0 12px', color: '#d9534f' }}>💡 Mẹo quản lý nhanh:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '2', fontSize: '14px' }}>
            <li><b>Menu Sản phẩm:</b> Nơi bạn đăng các mẫu xe mới, cập nhật giá và phân khối (cc).</li>
            <li><b>Menu Danh mục:</b> Phân loại xe theo dòng (Xe ga, Xe số, Moto PKL).</li>
            <li><b>Menu Đơn hàng:</b> Kiểm tra và xác nhận khi có khách hàng đặt xe trực tuyến.</li>
          </ul>
        </div>

      </div>
    );
  }

  componentDidMount() {
    this.apiLoadHomeData();
  }

  apiLoadHomeData() {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/customer/products/hot').then((res) => {
      this.setState({ hotProducts: res.data || [] });
    }).catch((err) => console.log(err));

    axios.get('/api/customer/products/new').then((res) => {
      this.setState({ newProducts: res.data || [] });
    }).catch((err) => console.log(err));

    axios.get('/api/admin/orders', config).then((res) => {
      const orders = res.data || [];
      this.setState({
        recentOrders: orders.slice(0, 5)
      });
    }).catch((err) => console.log(err));
  }
}

export default Home;