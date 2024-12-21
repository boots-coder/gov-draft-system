import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/my-manuscripts.css';

const MyManuscripts = () => {
    const navigate = useNavigate();
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('drafting'); // drafting, submitted, published

    // 模拟稿件数据
    const mockManuscripts = {
        drafting: [
            {
                id: 1,
                title: '数字经济发展趋势分析',
                draftId: 'DRAFT-2024-001',
                lastModified: '2024-03-15',
                wordCount: 3000,
                deadline: '2024-04-15',
                status: 'drafting'
            },
            {
                id: 2,
                title: '城市更新政策研究',
                draftId: 'DRAFT-2024-002',
                lastModified: '2024-03-14',
                wordCount: 2500,
                deadline: '2024-04-20',
                status: 'drafting'
            }
        ],
        submitted: [
            {
                id: 3,
                title: '乡村振兴战略实施效果',
                draftId: 'DRAFT-2024-003',
                submitDate: '2024-03-10',
                wordCount: 8000,
                reviewStatus: 'reviewing',
                reviewComments: [
                    { reviewer: '审稿人A', comment: '内容详实，建议加强数据分析' },
                    { reviewer: '审稿人B', comment: '结构需要优化' }
                ]
            }
        ],
        published: [
            {
                id: 4,
                title: '智慧城市建设研究报告',
                draftId: 'DRAFT-2024-004',
                publishDate: '2024-03-01',
                wordCount: 10000,
                views: 156,
                downloads: 23
            }
        ]
    };

    useEffect(() => {
        fetchManuscripts();
    }, [activeTab]);

    const fetchManuscripts = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            setManuscripts(mockManuscripts[activeTab]);
        } catch (error) {
            console.error('获取稿件失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderDrafting = () => (
        <div className="manuscripts-list">
            {manuscripts.map(manuscript => (
                <div key={manuscript.id} className="manuscript-card">
                    <div className="manuscript-header">
                        <h3 className="manuscript-title">{manuscript.title}</h3>
                        <span className="manuscript-id">{manuscript.draftId}</span>
                    </div>
                    <div className="manuscript-info">
                        <div className="info-item">
                            <span className="label">字数：</span>
                            <span>{manuscript.wordCount}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">最后修改：</span>
                            <span>{manuscript.lastModified}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">截止日期：</span>
                            <span>{manuscript.deadline}</span>
                        </div>
                    </div>
                    <div className="manuscript-actions">
                        <button
                            className="btn-action"
                            onClick={() => navigate(`/manuscripts/${manuscript.id}/edit`)}
                        >
                            继续编辑
                        </button>
                        <button
                            className="btn-action btn-submit"
                            onClick={() => navigate(`/manuscripts/${manuscript.id}/submit`)}
                        >
                            提交审核
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSubmitted = () => (
        <div className="manuscripts-list">
            {manuscripts.map(manuscript => (
                <div key={manuscript.id} className="manuscript-card">
                    <div className="manuscript-header">
                        <h3 className="manuscript-title">{manuscript.title}</h3>
                        <span className={`status-badge status-${manuscript.reviewStatus}`}>
              {manuscript.reviewStatus === 'reviewing' ? '审核中' : '需修改'}
            </span>
                    </div>
                    <div className="manuscript-info">
                        <div className="info-item">
                            <span className="label">提交日期：</span>
                            <span>{manuscript.submitDate}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">字数：</span>
                            <span>{manuscript.wordCount}</span>
                        </div>
                    </div>
                    {manuscript.reviewComments && (
                        <div className="review-comments">
                            <h4>审稿意见</h4>
                            {manuscript.reviewComments.map((comment, index) => (
                                <div key={index} className="review-comment">
                                    <div className="reviewer">{comment.reviewer}：</div>
                                    <div className="comment">{comment.comment}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="manuscript-actions">
                        <button
                            className="btn-action"
                            onClick={() => navigate(`/manuscripts/${manuscript.id}`)}
                        >
                            查看详情
                        </button>
                        {manuscript.reviewStatus === 'revision_needed' && (
                            <button
                                className="btn-action btn-revise"
                                onClick={() => navigate(`/manuscripts/${manuscript.id}/revise`)}
                            >
                                修改稿件
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderPublished = () => (
        <div className="manuscripts-list">
            {manuscripts.map(manuscript => (
                <div key={manuscript.id} className="manuscript-card">
                    <div className="manuscript-header">
                        <h3 className="manuscript-title">{manuscript.title}</h3>
                        <span className="publish-date">发布于 {manuscript.publishDate}</span>
                    </div>
                    <div className="manuscript-info">
                        <div className="info-item">
                            <span className="label">字数：</span>
                            <span>{manuscript.wordCount}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">阅读量：</span>
                            <span>{manuscript.views}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">下载量：</span>
                            <span>{manuscript.downloads}</span>
                        </div>
                    </div>
                    <div className="manuscript-actions">
                        <button
                            className="btn-action"
                            onClick={() => navigate(`/manuscripts/${manuscript.id}`)}
                        >
                            查看详情
                        </button>
                        <button className="btn-action">
                            下载PDF
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="my-manuscripts">
            <div className="page-header">
                <h2>我的稿件</h2>
            </div>

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'drafting' ? 'active' : ''}`}
                    onClick={() => setActiveTab('drafting')}
                >
                    撰写中
                </button>
                <button
                    className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('submitted')}
                >
                    已提交
                </button>
                <button
                    className={`tab-button ${activeTab === 'published' ? 'active' : ''}`}
                    onClick={() => setActiveTab('published')}
                >
                    已发表
                </button>
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="tab-content">
                    {activeTab === 'drafting' && renderDrafting()}
                    {activeTab === 'submitted' && renderSubmitted()}
                    {activeTab === 'published' && renderPublished()}
                </div>
            )}
        </div>
    );
};

export default MyManuscripts;