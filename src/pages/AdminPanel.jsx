import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchUsername, setSearchUsername] = useState('');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        role: 'author',
        permissions: ''
    });

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab, currentPage, pageSize, searchUsername]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/user/page`, {
                params: {
                    current: currentPage,
                    size: pageSize,
                    username: searchUsername || undefined
                }
            });
            if (response.data.code === 200) {
                setUsers(response.data.data.records);
            }
        } catch (error) {
            console.error('获取用户列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('确定要删除该用户吗？')) {
            try {
                const response = await axios.delete(`http://localhost:8081/api/user/${userId}`);
                if (response.data.code === 200) {
                    fetchUsers();
                }
            } catch (error) {
                console.error('删除用户失败:', error);
            }
        }
    };

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8081/api/user`, newUser);
            if (response.data.code === 200) {
                setShowAddUserModal(false);
                setNewUser({
                    username: '',
                    password: '',
                    role: 'author',
                    permissions: ''
                });
                fetchUsers();
            }
        } catch (error) {
            console.error('添加用户失败:', error);
            alert('添加用户失败: ' + error.response?.data?.msg || '未知错误');
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
            await new Promise(resolve => setTimeout(resolve, 500));
            alert('设置保存成功');
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    };

    const AddUserModal = () => (
        <div className="modal">
            <div className="modal-content">
                <h3>添加新用户</h3>
                <form onSubmit={handleAddUserSubmit}>
                    <div className="form-group">
                        <label>用户名</label>
                        <input
                            type="text"
                            value={newUser.username}
                            onChange={e => setNewUser({...newUser, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>密码</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>角色</label>
                        <select
                            value={newUser.role}
                            onChange={e => setNewUser({...newUser, role: e.target.value})}
                        >
                            <option value="author">作者</option>
                            <option value="editor">编辑</option>
                            <option value="reviewer">评审</option>
                            <option value="admin">管理员</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>权限</label>
                        <input
                            type="text"
                            value={newUser.permissions}
                            onChange={e => setNewUser({...newUser, permissions: e.target.value})}
                            placeholder="输入权限信息"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">确认</button>
                        <button type="button" onClick={() => setShowAddUserModal(false)}>取消</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderUsersTab = () => (
        <div className="users-management">
            <div className="table-header">
                <h3>用户管理</h3>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="搜索用户名"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                    />
                </div>
                <button className="btn-add" onClick={() => setShowAddUserModal(true)}>添加用户</button>
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="table-responsive">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>用户ID</th>
                            <th>用户名</th>
                            <th>角色</th>
                            <th>权限</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.username}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role === 'editor' ? '编辑' :
                                            user.role === 'author' ? '作者' :
                                                user.role === 'reviewer' ? '评审' : '管理员'}
                                    </span>
                                </td>
                                <td>{user.permissions}</td>
                                <td>{user.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-action btn-danger"
                                            onClick={() => handleDeleteUser(user.userId)}
                                        >
                                            删除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            上一页
                        </button>
                        <span>第 {currentPage} 页</span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={users.length < pageSize}
                        >
                            下一页
                        </button>
                    </div>
                </div>
            )}
            {showAddUserModal && <AddUserModal />}
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