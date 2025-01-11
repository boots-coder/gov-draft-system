import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/draft-detail.css';

const API_PREFIX = 'http://localhost:8081/api';

const DraftListWithActions = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, total: 0 });
    const [formData, setFormData] = useState({
        topic: '',
        solicitorId: '',
        deadline: '',
    });
    const [editDraftId, setEditDraftId] = useState(null); // 当前正在编辑的稿件 ID
    const [isAdding, setIsAdding] = useState(false); // 是否处于新增模式

    useEffect(() => {
        fetchPaginationData(pageInfo.current);
    }, [pageInfo.current]);

    // 分页查询约稿列表
    const fetchPaginationData = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_PREFIX}/solicitation/page`, {
                params: { current: page, size: pageInfo.pageSize },
            });
            if (response.data.code === 200) {
                const data = response.data.data;
                setDrafts(data.records);
                setPageInfo({
                    current: data.current,
                    pageSize: data.size,
                    total: data.total,
                });
            }
        } catch (error) {
            console.error('分页查询失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 新增约稿
    const handleCreate = async () => {
        try {
            const response = await axios.post(`${API_PREFIX}/solicitation`, formData);
            alert(response.data.msg || '新增成功');
            setIsAdding(false);
            fetchPaginationData(1); // 刷新列表到第一页
        } catch (error) {
            console.error('新增失败:', error);
            alert('新增失败');
        }
    };

    // 更新约稿
    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${API_PREFIX}/solicitation`, {
                ...formData,
                solicitationId: editDraftId,
            });
            alert(response.data.msg || '更新成功');
            setEditDraftId(null);
            fetchPaginationData(pageInfo.current);
        } catch (error) {
            console.error('更新失败:', error);
            alert('更新失败');
        }
    };

    // 删除约稿
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_PREFIX}/solicitation/${id}`);
            alert(response.data.msg || '删除成功');
            fetchPaginationData(pageInfo.current);
        } catch (error) {
            console.error('删除失败:', error);
            alert('删除失败');
        }
    };

    // 切换到编辑模式
    const startEditing = (draft) => {
        setEditDraftId(draft.solicitedPersonId);
        setFormData({ topic: draft.topic, deadline: draft.deadline });
    };

    // 渲染新增表单
    const renderAddForm = () => (
        <div className="add-form">
            <h3>新增约稿</h3>
            <label>
                主题：
                <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                />
            </label>
            <label>
                发起人 ID：
                <input
                    type="number"
                    value={formData.solicitedPersonId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, solicitorId: e.target.value }))}
                />
            </label>
            <label>
                截止日期：
                <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                />
            </label>
            <button onClick={handleCreate}>保存</button>
            <button onClick={() => setIsAdding(false)}>取消</button>
        </div>
    );

    // 渲染约稿列表
    const renderDraftList = () => (
        <div className="draft-list">
            {drafts.length > 0 ? (
                drafts.map((draft) => (
                    <div key={draft.solicitationId} className="draft-card">
                        <div className="draft-info">
                            <p><b>主题：</b>{draft.topic}</p>
                            <p><b>提交时间：</b>{new Date(draft.solicitedAt).toLocaleString()}</p>
                            <p><b>截止日期：</b>{draft.deadline}</p>
                        </div>
                        <div className="draft-actions">
                            {editDraftId === draft.solicitationId ? (
                                <div className="edit-form">
                                    <label>
                                        主题：
                                        <input
                                            type="text"
                                            value={formData.topic}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    topic: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        截止日期：
                                        <input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    deadline: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <button onClick={handleUpdate}>保存</button>
                                    <button onClick={() => setEditDraftId(null)}>取消</button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => startEditing(draft)}>编辑</button>
                                    <button onClick={() => handleDelete(draft.solicitationId)}>删除</button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>暂无约稿信息</p>
            )}
        </div>
    );

    // 渲染分页控件
    const renderPaginationControls = () => (
        <div className="pagination-controls">
            <button
                onClick={() => setPageInfo((prev) => ({ ...prev, current: prev.current - 1 }))}
                disabled={pageInfo.current === 1}
            >
                上一页
            </button>
            <span>
                第 {pageInfo.current} 页 / 共 {Math.ceil(pageInfo.total / pageInfo.pageSize)} 页
            </span>
            <button
                onClick={() => setPageInfo((prev) => ({ ...prev, current: prev.current + 1 }))}
                disabled={pageInfo.current === Math.ceil(pageInfo.total / pageInfo.pageSize)}
            >
                下一页
            </button>
        </div>
    );

    if (loading) return <div className="loading">加载中...</div>;

    return (
        <div className="draft-detail">
            <h2>约稿列表</h2>
            {!isAdding ? (
                <>
                    <button onClick={() => setIsAdding(true)}>新增约稿</button>
                    {renderDraftList()}
                    {renderPaginationControls()}
                </>
            ) : (
                renderAddForm()
            )}
        </div>
    );
};

export default DraftListWithActions;