import React, { useState, useEffect } from 'react';
import '../styles/manuscript-management.css';

const ManuscriptManagement = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        searchText: '',
    });

    // 模拟稿件数据
    const mockManuscripts = [
        {
            id: 1,
            title: '数字化转型政策研究报告',
            author: '张三',
            status: 'pending_review',
            submitDate: '2024-03-15',
            reviewers: ['李四', '王五'],
            category: '政策研究',
            wordCount: 8000,
            currentReviewRound: 1,
        },
        {
            id: 2,
            title: '乡村振兴实施效果分析',
            author: '李四',
            status: 'reviewing',
            submitDate: '2024-03-14',
            reviewers: ['张三', '王五'],
            category: '调研报告',
            wordCount: 12000,
            currentReviewRound: 2,
        },
        // 更多模拟数据...
    ];

    useEffect(() => {
        fetchManuscripts();
    }, [filters]);

    const fetchManuscripts = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            setManuscripts(mockManuscripts);
        } catch (error) {
            console.error('获取稿件列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // 实现搜索逻辑
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending_review: '待审核',
            reviewing: '审核中',
            revision_needed: '需修改',
            accepted: '已通过',
            rejected: '已拒绝',
            published: '已发布'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            pending_review: 'status-pending',
            reviewing: 'status-reviewing',
            revision_needed: 'status-revision',
            accepted: 'status-accepted',
            rejected: 'status-rejected',
            published: 'status-published'
        };
        return classMap[status] || '';
    };

    const assignReviewer = async (manuscriptId) => {
        // 实现分配审稿人逻辑
    };

    const publishManuscript = async (manuscriptId) => {
        // 实现发布稿件逻辑
    };

    return (
        <div className="manuscript-management">
            <div className="page-header">
                <h2>稿件管理</h2>
            </div>

            <div className="filters-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="搜索稿件标题或作者"
                        value={filters.searchText}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">搜索</button>
                </form>

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="all">所有状态</option>
                    <option value="pending_review">待审核</option>
                    <option value="reviewing">审核中</option>
                    <option value="revision_needed">需修改</option>
                    <option value="accepted">已通过</option>
                    <option value="rejected">已拒绝</option>
                    <option value="published">已发布</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="manuscripts-list">
                    {manuscripts.map(manuscript => (
                        <div key={manuscript.id} className="manuscript-card">
                            <div className="manuscript-header">
                                <h3 className="manuscript-title">{manuscript.title}</h3>
                                <span className={`status-badge ${getStatusClass(manuscript.status)}`}>
                  {getStatusText(manuscript.status)}
                </span>
                            </div>

                            <div className="manuscript-info">
                                <div className="info-row">
                                    <span>作者：{manuscript.author}</span>
                                    <span>提交时间：{manuscript.submitDate}</span>
                                    <span>字数：{manuscript.wordCount}</span>
                                </div>
                                <div className="info-row">
                                    <span>类别：{manuscript.category}</span>
                                    <span>当前轮次：第 {manuscript.currentReviewRound} 轮</span>
                                </div>
                                <div className="info-row">
                                    <span>审稿人：{manuscript.reviewers.join('、') || '暂未分配'}</span>
                                </div>
                            </div>

                            <div className="manuscript-actions">
                                <button
                                    className="btn-action"
                                    onClick={() => window.location.href = `/manuscripts/${manuscript.id}`}
                                >
                                    查看详情
                                </button>
                                {manuscript.status === 'pending_review' && (
                                    <button
                                        className="btn-action"
                                        onClick={() => assignReviewer(manuscript.id)}
                                    >
                                        分配审稿人
                                    </button>
                                )}
                                {manuscript.status === 'accepted' && (
                                    <button
                                        className="btn-action btn-publish"
                                        onClick={() => publishManuscript(manuscript.id)}
                                    >
                                        发布
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManuscriptManagement;