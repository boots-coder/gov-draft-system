import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/draft-list.css';

const DraftList = () => {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        searchText: '',
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // 模拟数据
    const mockDrafts = [
        {
            id: 1,
            title: '关于数字化转型的政策研究',
            category: '政策研究',
            status: 'open',
            deadline: '2024-12-31',
            budget: 5000,
            requirements: '需要详细分析数字化转型带来的机遇与挑战',
            publishDate: '2024-03-15',
        },
        {
            id: 2,
            title: '乡村振兴战略实施效果评估',
            category: '调研报告',
            status: 'in_progress',
            deadline: '2024-11-30',
            budget: 8000,
            requirements: '实地调研乡村振兴政策实施效果',
            publishDate: '2024-03-14',
        },
        // 添加更多模拟数据...
    ];

    useEffect(() => {
        fetchDrafts();
    }, [filters, pagination.current]);

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            setDrafts(mockDrafts);
            setPagination(prev => ({ ...prev, total: 100 }));
        } catch (error) {
            console.error('获取约稿列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }));
    };

    const getStatusText = (status) => {
        const statusMap = {
            open: '招稿中',
            in_progress: '进行中',
            completed: '已完成',
            cancelled: '已取消'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            open: 'status-open',
            in_progress: 'status-progress',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return classMap[status] || '';
    };

    return (
        <div className="draft-list-page">
            <div className="page-header">
                <h2>约稿列表</h2>
                {localStorage.getItem('userRole') === 'editor' && (
                    <button
                        className="btn-create"
                        onClick={() => navigate('/drafts/create')}
                    >
                        发布约稿
                    </button>
                )}
            </div>

            <div className="filters-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="搜索约稿标题"
                        value={filters.searchText}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">搜索</button>
                </form>

                <div className="filter-controls">
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="all">所有状态</option>
                        <option value="open">招稿中</option>
                        <option value="in_progress">进行中</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                    </select>

                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="all">所有类别</option>
                        <option value="policy">政策研究</option>
                        <option value="report">调研报告</option>
                        <option value="analysis">分析文章</option>
                    </select>
                </div>
            </div>

            <div className="draft-list">
                {loading ? (
                    <div className="loading">加载中...</div>
                ) : drafts.length > 0 ? (
                    drafts.map(draft => (
                        <div key={draft.id} className="draft-card" onClick={() => navigate(`/drafts/${draft.id}`)}>
                            <div className="draft-header">
                                <h3 className="draft-title">{draft.title}</h3>
                                <span className={`status-badge ${getStatusClass(draft.status)}`}>
                  {getStatusText(draft.status)}
                </span>
                            </div>
                            <div className="draft-info">
                                <span>类别：{draft.category}</span>
                                <span>截止日期：{draft.deadline}</span>
                                <span>预算：¥{draft.budget}</span>
                            </div>
                            <p className="draft-requirements">{draft.requirements}</p>
                            <div className="draft-footer">
                                <span className="publish-date">发布日期：{draft.publishDate}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">暂无约稿信息</div>
                )}
            </div>

            {drafts.length > 0 && (
                <div className="pagination">
                    <button
                        disabled={pagination.current === 1}
                        onClick={() => handlePageChange(pagination.current - 1)}
                        className="btn-page"
                    >
                        上一页
                    </button>
                    <span className="page-info">
            第 {pagination.current} 页 / 共 {Math.ceil(pagination.total / pagination.pageSize)} 页
          </span>
                    <button
                        disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
                        onClick={() => handlePageChange(pagination.current + 1)}
                        className="btn-page"
                    >
                        下一页
                    </button>
                </div>
            )}
        </div>
    );
};

export default DraftList;
