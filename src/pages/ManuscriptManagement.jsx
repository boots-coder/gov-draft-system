import React, { useState, useEffect } from 'react';
import '../styles/manuscript-management.css';
import axios from 'axios';

// 创建axios实例
const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const ManuscriptManagement = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [filters, setFilters] = useState({
        status: 'all',
        searchText: '',
    });
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        articleId: null,
        status: '',
        comments: ''
    });

    useEffect(() => {
        fetchManuscripts();
    }, [filters, currentPage]);

    const mapBackendStatusToFrontend = (status) => {
        const statusMap = {
            'PENDING': '待审核',
            'APPROVED': '已采纳',
            'PUBLISHED': '已发布'
        };
        return statusMap[status] || status;
    };

    const fetchManuscripts = async () => {
        setLoading(true);
        try {
            let url = `/article/page?current=${currentPage}&size=${pageSize}`;
            if (filters.status !== 'all') {
                url += `&status=${filters.status}`;
            }
            console.log('Fetching from URL:', url);
            const response = await api.get(url);
            if (response.data.code === 200) {
                const processedData = response.data.data.records.map((item) => ({
                    ...item,
                    status: mapBackendStatusToFrontend(item.status)
                }));
                setManuscripts(processedData);
            }
        } catch (error) {
            console.error('获取稿件列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchManuscripts();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleReviewClick = (articleId, status) => {
        setReviewData({
            articleId,
            status,
            comments: ''
        });
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async () => {
        try {
            const response = await api.put(
                `/article/review/${reviewData.articleId}`,
                null,
                {
                    params: {
                        status: reviewData.status,
                        comments: reviewData.comments
                    }
                }
            );
            if (response.data.code === 200) {
                setShowReviewModal(false);
                fetchManuscripts();
            }
        } catch (error) {
            console.error('审核失败:', error);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            '待审核': '待审核',
            '已采纳': '已采纳',
            '已发布': '已发布'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            '待审核': 'status-pending',
            '已采纳': 'status-accepted',
            '已发布': 'status-published'
        };
        return classMap[status] || '';
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '';
        const date = new Date(dateTimeStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        placeholder="搜索稿件内容"
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
                    <option value="待审核">待审核</option>
                    <option value="已采纳">已采纳</option>
                    <option value="已发布">已发布</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="manuscripts-list">
                    {manuscripts.map(manuscript => (
                        <div key={manuscript.articleId} className="manuscript-card">
                            <div className="manuscript-header">
                                <h3 className="manuscript-title">
                                    {manuscript.content?.substring(0, 50)}...
                                </h3>
                                <span className={`status-badge ${getStatusClass(manuscript.status)}`}>
                                    {getStatusText(manuscript.status)}
                                </span>
                            </div>

                            <div className="manuscript-info">
                                <div className="info-row">
                                    <span>提交人：{manuscript.submitterName || '未知'}</span>
                                    <span>提交时间：{formatDateTime(manuscript.submittedAt)}</span>
                                </div>
                            </div>

                            <div className="manuscript-actions">
                                <button
                                    className="btn-action"
                                    onClick={() => window.location.href = `/article/${manuscript.articleId}`}
                                >
                                    查看详情
                                </button>
                                {manuscript.status === '待审核' && (
                                    <>
                                        <button
                                            className="btn-action btn-approve"
                                            onClick={() => handleReviewClick(manuscript.articleId, '已采纳')}
                                        >
                                            采纳
                                        </button>
                                        <button
                                            className="btn-action btn-reject"
                                            onClick={() => handleReviewClick(manuscript.articleId, '拒绝')}
                                        >
                                            拒绝
                                        </button>
                                    </>
                                )}
                                {manuscript.status === '已采纳' && (
                                    <button
                                        className="btn-action btn-publish"
                                        onClick={() => handleReviewClick(manuscript.articleId, '已发布')}
                                    >
                                        发布
                                    </button>
                                )}
                            </div>                        </div>
                    ))}
                </div>
            )}

            {/* 审核模态框 */}
            {showReviewModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>审核意见</h3>
                        <textarea
                            value={reviewData.comments}
                            onChange={(e) => setReviewData(prev => ({
                                ...prev,
                                comments: e.target.value
                            }))}
                            placeholder="请输入审核意见（选填）"
                            rows="4"
                        />
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowReviewModal(false)}
                            >
                                取消
                            </button>
                            <button
                                className="btn-confirm"
                                onClick={handleReviewSubmit}
                            >
                                确认
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManuscriptManagement;