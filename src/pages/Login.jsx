import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'editor' // 默认角色
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 这里应该是实际的API调用
      // const response = await loginApi(formData);

      // 模拟登录成功
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', formData.username);

      // 根据角色跳转到不同页面
      switch (formData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'editor':
          navigate('/manuscripts');
          break;
        case 'author':
          navigate('/my-manuscripts');
          break;
        case 'reviewer':
          navigate('/reviews');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    }
  };

  return (
      <div className="login-container">
        <div className="login-card">
          <h2>政府约稿系统</h2>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="请输入用户名"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="请输入密码"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">角色</label>
              <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
              >
                <option value="editor">编辑</option>
                <option value="author">作者</option>
                <option value="reviewer">评审员</option>
                <option value="admin">管理员</option>
              </select>
            </div>

            <button type="submit" className="login-button">
              登录
            </button>

            <div className="login-footer">
              <a href="#" className="forgot-password">
                忘记密码？
              </a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;