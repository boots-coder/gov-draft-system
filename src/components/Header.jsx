import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
    const navigate = useNavigate();
    // 模拟用户登录状态
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userRole, setUserRole] = React.useState('editor'); // 可能的值: admin, editor, author, reviewer

    const handleLogout = () => {
        setIsLoggedIn(false);
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
                            <span className="username">用户名</span>
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