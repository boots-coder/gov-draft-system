import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/header.css';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        // 检查本地存储中的登录状态
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setUserRole(user.role);
            setUsername(user.username);
        }
    }, []);

    const handleLogin = async (loginUsername, loginPassword) => {
        try {
            const response = await axios.get('/api/login', {
                params: {
                    username: loginUsername,
                    password: loginPassword
                }
            });

            if (response.data.code === 200) {
                const user = response.data.data;
                setIsLoggedIn(true);
                setUserRole(user.role);
                setUsername(user.username);

                // 存储用户信息到本地存储
                localStorage.setItem('user', JSON.stringify(user));

                // 根据角色导航到不同页面
                switch (user.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'editor':
                        navigate('/manuscripts');
                        break;
                    case 'author':
                        navigate('/my-manuscripts');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                alert(response.data.msg);
            }
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录失败，请稍后重试');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole('');
        setUsername('');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">政府约稿系统</Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">首页</Link></li>
                        <li><Link to="/drafts">约稿列表</Link></li>
                        {userRole === 'admin' && (
                            <li><Link to="/admin">系统管理</Link></li>
                        )}
                        {userRole === 'editor' && (
                            <li><Link to="/manuscripts">稿件管理</Link></li>
                        )}
                        {userRole === 'author' && (
                            <li><Link to="/my-manuscripts">我的稿件</Link></li>
                        )}
                    </ul>
                </nav>
                <div className="user-actions">
                    {isLoggedIn ? (
                        <>
                            <span className="username">{username}</span>
                            <button onClick={handleLogout} className="btn-logout">
                                退出
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-login">
                            登录
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;