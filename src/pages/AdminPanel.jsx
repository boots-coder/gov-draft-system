import React, { useState, useEffect } from 'react';
import '../styles/admin-panel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [systemSettings, setSystemSettings] = useState({
        allowNewRegistrations: true,
        defaultDraftDeadlineDays: 30,
        maxDraftBudget: 100000,
        minDraftBudget: 1000,
        reviewerCount: 3,
    });
    const [loading, setLoading] = useState(false);

    // 模拟用户数据
    const mockUsers = [
        {
            id: 1,
            username: 'editor1',
            role: 'editor',
            status: 'active',
            lastLogin: '2024-03-15 10:30:00',
            createdAt: '2024-01-01',
        },
        {
            id: 2,
            username: 'author1',
            role: 'author',
            status: 'active',
            lastLogin: '2024-03-14 15:20:00',
            createdAt: '2024-01-02',
        },
        // 添加更多模拟数据...
    ];

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUsers(mockUsers);
        } catch (error) {
            console.error('获取用户列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatusChange = async (userId, newStatus) => {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(users.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));
        } catch (error) {
            console.error('更新用户状态失败:', error);
        }
    };

    const handleSettingChange = (setting, value) => {
        setSystemSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const saveSettings = async () => {
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            alert('设置保存成功');
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    };

    const renderUsersTab = () => (
        <div className="users-management">
            <div className="table-header">
                <h3>用户管理</h3>
                <button className="btn-add">添加用户</button>
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="table-responsive">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>用户名</th>
                            <th>角色</th>
                            <th>状态</th>
                            <th>最后登录</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'editor' ? '编辑' :
                          user.role === 'author' ? '作者' :
                              user.role === 'reviewer' ? '评审' : '管理员'}
                    </span>
                                </td>
                                <td>
                    <span className={`status-badge status-${user.status}`}>
                      {user.status === 'active' ? '正常' : '禁用'}
                    </span>
                                </td>
                                <td>{user.lastLogin}</td>
                                <td>{user.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-action"
                                            onClick={() => handleUserStatusChange(
                                                user.id,
                                                user.status === 'active' ? 'disabled' : 'active'
                                            )}
                                        >
                                            {user.status === 'active' ? '禁用' : '启用'}
                                        </button>
                                        <button className="btn-action">编辑</button>
                                        <button className="btn-action btn-danger">删除</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderSettingsTab = () => (
        <div className="system-settings">
            <h3>系统设置</h3>
            <div className="settings-form">
                <div className="setting-item">
                    <label>
                        <input
                            type="checkbox"
                            checked={systemSettings.allowNewRegistrations}
                            onChange={(e) => handleSettingChange('allowNewRegistrations', e.target.checked)}
                        />
                        允许新用户注册
                    </label>
                </div>

                <div className="setting-item">
                    <label>默认约稿截止天数</label>
                    <input
                        type="number"
                        value={systemSettings.defaultDraftDeadlineDays}
                        onChange={(e) => handleSettingChange('defaultDraftDeadlineDays', parseInt(e.target.value))}
                        min="1"
                        max="365"
                    />
                </div>

                <div className="setting-item">
                    <label>最大约稿预算（元）</label>
                    <input
                        type="number"
                        value={systemSettings.maxDraftBudget}
                        onChange={(e) => handleSettingChange('maxDraftBudget', parseInt(e.target.value))}
                        min="1000"
                    />
                </div>

                <div className="setting-item">
                    <label>最小约稿预算（元）</label>
                    <input
                        type="number"
                        value={systemSettings.minDraftBudget}
                        onChange={(e) => handleSettingChange('minDraftBudget', parseInt(e.target.value))}
                        min="100"
                    />
                </div>

                <div className="setting-item">
                    <label>默认评审人数</label>
                    <input
                        type="number"
                        value={systemSettings.reviewerCount}
                        onChange={(e) => handleSettingChange('reviewerCount', parseInt(e.target.value))}
                        min="1"
                        max="5"
                    />
                </div>

                <button className="btn-save" onClick={saveSettings}>
                    保存设置
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-panel">
            <h2>系统管理</h2>

            <div className="admin-tabs">
                <button
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    用户管理
                </button>
                <button
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    系统设置
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'users' ? renderUsersTab() : renderSettingsTab()}
            </div>
        </div>
    );
};

export default AdminPanel;