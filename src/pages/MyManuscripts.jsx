import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/my-manuscripts.css';

const MyManuscripts = () => {
    const navigate = useNavigate();
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 状态：pending, accepted, published, rejected
    const [newArticleContent, setNewArticleContent] = useState(''); // 新稿件内容
    const [showSubmitForm, setShowSubmitForm] = useState(false); // 控制提交表单的显示

    // 获取用户ID
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchManuscripts();
        } else {
            console.error('用户ID未找到');
        }
    }, [activeTab]);

    const fetchManuscripts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/article/user/${userId}`, {
                params: { current: 1, size: 10 },
            });
            const data = response.data.data.records;

            // 根据状态分类文稿
            const categorized = {
                pending: data.filter((manuscript) => manuscript.status === '待审核'),
                accepted: data.filter((manuscript) => manuscript.status === '已采纳'),
                published: data.filter((manuscript) => manuscript.status === '已发布'),
                rejected: data.filter((manuscript) => manuscript.status === '拒绝'),
            };
            setManuscripts(categorized[activeTab]);
        } catch (error) {
            console.error('获取稿件失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitArticle = async (e) => {
        e.preventDefault();

        // 构建提交数据
        const newArticle = {
            content: newArticleContent,
            submitterId: parseInt(userId, 10), // 提交者ID
        };

        try {
            const response = await axios.post('http://localhost:8081/api/article/submit', newArticle, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.code === 200) {
                alert('稿件提交成功！');
                setNewArticleContent('');
                setShowSubmitForm(false);
                fetchManuscripts(); // 刷新列表
            } else {
                alert(response.data.msg || '稿件提交失败，请重试！');
            }
        } catch (error) {
            console.error('提交稿件失败:', error);
            alert('提交稿件失败，请检查网络连接或稍后重试！');
        }
    };

    const renderTabContent = () => {
        if (manuscripts.length === 0) {
            return <div className="no-data">暂无数据</div>;
        }

        return (
            <div className="manuscripts-list">
                {manuscripts.map((manuscript) => (
                    <div key={manuscript.articleId} className="manuscript-card">
                        <div className="manuscript-header">
                            <h3 className="manuscript-title">{manuscript.title || '无标题'}</h3>
                            <span className="status-badge">{manuscript.status}</span>
                        </div>
                        <div className="manuscript-info">
                            <div className="info-item">
                                <span className="label">提交时间：</span>
                                <span>{new Date(manuscript.submittedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="manuscript-actions">
                            <button
                                className="btn-action"
                                onClick={() => navigate(`/manuscripts/${manuscript.articleId}`)}
                            >
                                查看详情
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="my-manuscripts">
            <div className="page-header">
                <h2>我的稿件</h2>
                <button
                    className="btn-add-new"
                    onClick={() => setShowSubmitForm((prev) => !prev)}
                >
                    {showSubmitForm ? '取消' : '提交新稿件'}
                </button>
            </div>

            {showSubmitForm && (
                <form className="submit-form" onSubmit={handleSubmitArticle}>
                    <h3>提交新稿件</h3>
                    <div className="form-group">
                        <label htmlFor="content">稿件内容</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newArticleContent}
                            onChange={(e) => setNewArticleContent(e.target.value)}
                            required
                            rows="5"
                            placeholder="请输入稿件内容..."
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-submit">提交</button>
                </form>
            )}

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    待审核
                </button>
                <button
                    className={`tab-button ${activeTab === 'accepted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accepted')}
                >
                    已采纳
                </button>
                <button
                    className={`tab-button ${activeTab === 'published' ? 'active' : ''}`}
                    onClick={() => setActiveTab('published')}
                >
                    已发布
                </button>
                <button
                    className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rejected')}
                >
                    拒绝
                </button>
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="tab-content">{renderTabContent()}</div>
            )}
        </div>
    );
};

export default MyManuscripts;