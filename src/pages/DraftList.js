import React, { useState, useEffect } from 'react';
import '../styles/draft-list.css';

const DraftList = () => {
    const [drafts, setDrafts] = useState([]);
    const [filteredDrafts, setFilteredDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        searchText: '',
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        fetchDrafts();
    }, [pagination.current]);

    useEffect(() => {
        filterDrafts();
    }, [filters.searchText, drafts]);

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8081/api/solicitation/page?current=${pagination.current}&size=${pagination.pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (data.code === 200) {
                setDrafts(data.data.records);
                setPagination(prev => ({
                    ...prev,
                    total: data.data.total,
                }));
            } else {
                setDrafts([]);
                setPagination(prev => ({
                    ...prev,
                    total: 0,
                }));
            }
        } catch (error) {
            console.error('获取约稿列表失败:', error);
            setDrafts([]);
            setPagination(prev => ({
                ...prev,
                total: 0,
            }));
        } finally {
            setLoading(false);
        }
    };

    const filterDrafts = () => {
        const searchText = filters.searchText.trim().toLowerCase();
        if (!searchText) {
            setFilteredDrafts(drafts);
            setPagination(prev => ({
                ...prev,
                total: drafts.length
            }));
            return;
        }

        const filtered = drafts.filter(draft =>
            draft.topic.toLowerCase().includes(searchText)
        );

        setFilteredDrafts(filtered);
        setPagination(prev => ({
            ...prev,
            total: filtered.length
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }));
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getCurrentPageData = () => {
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return filteredDrafts.slice(startIndex, endIndex);
    };

    const currentPageData = getCurrentPageData();

    return (
        <div className="draft-list-page">
            <div className="page-header">
                <h2>约稿列表</h2>
            </div>

            <div className="filters-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="搜索约稿主题"
                        value={filters.searchText}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">搜索</button>
                </form>
            </div>

            <div className="draft-list">
                {loading ? (
                    <div className="loading">加载中...</div>
                ) : currentPageData.length > 0 ? (
                    currentPageData.map(draft => (
                        <div key={draft.solicitationId} className="draft-card">
                            <div className="draft-header">
                                <h3 className="draft-title">{draft.topic}</h3>
                            </div>
                            <div className="draft-info">
                                <span>提交时间：{formatDate(draft.solicitedAt)}</span>
                                <span>截止日期：{formatDate(draft.deadline)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">暂无约稿信息</div>
                )}
            </div>

            {filteredDrafts.length > 0 && (
                <div className="pagination">
                    <button
                        disabled={pagination.current === 1}
                        onClick={() => handlePageChange(pagination.current - 1)}
                        className="btn-page"
                    >
                        上一页
                    </button>
                    <span className="page-info">
                        第 {pagination.current} 页 / 共 {Math.ceil(filteredDrafts.length / pagination.pageSize)} 页
                    </span>
                    <button
                        disabled={pagination.current === Math.ceil(filteredDrafts.length / pagination.pageSize)}
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