import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'admin',
    password: '1',
    role: 'editor' // 默认角色
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
          'http://localhost:8081/api/user/login',
          {
            username: formData.username,
            password: formData.password,
            userId: formData.userId
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      if (response.data.code === 200) {
        const userData = response.data.data; // 后端返回的用户信息，包括 userId
        const userInfo = {
          username: formData.username,
          role: formData.role,
          userId: userData.userId // 假设返回的用户 ID 为 `id`
        };

        // 保存用户信息到 localStorage
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('userRole', userInfo.role);
        localStorage.setItem('userId', userInfo.userId); // 保存用户ID

        // 根据选择的角色跳转到不同页面
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
            navigate('/final-review'); // 路由到“最终审核”页面
            break;
          default:
            navigate('/');
        }
      } else {
        setError(response.data.msg || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      console.error('登录错误:', err);
      if (err.response) {
        setError(err.response.data.msg || '登录失败，请检查用户名和密码');
      } else {
        setError('登录失败，请检查网络连接或稍后重试');
      }
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
                <option value="admin">管理员</option>
                <option value="reviewer">审核员</option> {/* 添加审核员角色 */}
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