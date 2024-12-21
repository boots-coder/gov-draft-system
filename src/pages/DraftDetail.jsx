import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/draft-detail.css';

const DraftDetail = () => {
    const { id } = useParams();
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // info, content, reviews, history

    // 模拟稿件详情数据
    const mockDraft = {
        id: 1,
        title: '数字经济发展趋势分析报告',
        draftId: 'DRAFT-2024-001',
        author: '张三',
        category: '政策研究',
        status: 'reviewing',
        submitDate: '2024-03-15',
        deadline: '2024-04-15',
        budget: 8000,
        wordCount: 12000,
        abstract: '本报告主要分析了数字经济发展现状、趋势及面临的挑战，并提出相关政策建议...',
        keywords: ['数字经济', '政策研究', '发展趋势', '创新'],
        content: `# 数字经济发展趋势分析报告

## 一、引言
数字经济作为新时代经济发展的重要引擎...

## 二、数字经济发展现状
2.1 整体规模
2.2 产业结构
2.3 区域分布

## 三、发展趋势分析
3.1 技术创新驱动
3.2 产业融合加速
3.3 数字化转型深化

## 四、面临的挑战
4.1 数据安全
4.2 人才短缺
4.3 区域发展不平衡

## 五、政策建议
5.1 完善政策体系
5.2 加强人才培养
5.3 促进协调发展

## 六、结论
...`,
        reviews: [
            {
                id: 1,
                reviewer: '审稿人A',
                date: '2024-03-16',
                status: 'completed',
                score: {
                    novelty: 8,
                    quality: 9,
                    relevance: 8,
                    clarity: 7
                },
                comments: '整体内容详实，论述有力。建议在以下方面进行完善：\n1. 加强数据支撑\n2. 细化政策建议\n3. 补充国际比较',
                decision: 'minor_revision'
            },
            {
                id: 2,
                reviewer: '审稿人B',
                date: '2024-03-17',
                status: 'completed',
                score: {
                    novelty: 7,
                    quality: 8,
                    relevance: 9,
                    clarity: 8
                },
                comments: '研究视角新颖，分析深入。需要注意：\n1. 完善研究方法说明\n2. 加强政策可行性分析\n3. 更新部分数据',
                decision: 'minor_revision'
            }
        ],
        history: [
            {
                date: '2024-03-10',
                action: 'created',
                operator: '张三',
                details: '创建稿件'
            },
            {
                date: '2024-03-15',
                action: 'submitted',
                operator: '张三',
                details: '提交审核'
            },
            {
                date: '2024-03-15',
                action: 'assigned_reviewer',
                operator: '李编辑',
                details: '分配审稿人'
            },
            {
                date: '2024-03-16',
                action: 'review_completed',
                operator: '审稿人A',
                details: '完成审稿'
            },
            {
                date: '2024-03-17',
                action: 'review_completed',
                operator: '审稿人B',
                details: '完成审稿'
            }
        ]
    };

    useEffect(() => {
        fetchDraftDetail();
    }, [id]);

    const fetchDraftDetail = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            setDraft(mockDraft);
        } catch (error) {
            console.error('获取稿件详情失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            draft: '草稿',
            submitted: '已提交',
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
            draft: 'status-draft',
            submitted: 'status-submitted',
            reviewing: 'status-reviewing',
            revision_needed: 'status-revision',
            accepted: 'status-accepted',
            rejected: 'status-rejected',
            published: 'status-published'
        };
        return classMap[status] || '';
    };

    const renderInfo = () => (
        <div className="draft-info-section">
            <div className="info-group">
                <div className="info-item">
                    <span className="label">稿件编号：</span>
                    <span>{draft.draftId}</span>
                </div>
                <div className="info-item">
                    <span className="label">作者：</span>
                    <span>{draft.author}</span>
                </div>
                <div className="info-item">
                    <span className="label">类别：</span>
                    <span>{draft.category}</span>
                </div>
            </div>

            <div className="info-group">
                <div className="info-item">
                    <span className="label">提交日期：</span>
                    <span>{draft.submitDate}</span>
                </div>
                <div className="info-item">
                    <span className="label">截止日期：</span>
                    <span>{draft.deadline}</span>
                </div>
                <div className="info-item">
                    <span className="label">字数：</span>
                    <span>{draft.wordCount}</span>
                </div>
            </div>

            <div className="info-group">
                <div className="info-item">
                    <span className="label">预算：</span>
                    <span>¥{draft.budget}</span>
                </div>
                <div className="info-item">
                    <span className="label">关键词：</span>
                    <div className="keywords">
                        {draft.keywords.map((keyword, index) => (
                            <span key={index} className="keyword">{keyword}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="abstract-section">
                <h3>摘要</h3>
                <p>{draft.abstract}</p>
            </div>
        </div>
    );

    const renderContent = () => (
        <div className="draft-content-section">
            <div className="content-wrapper">
                {draft.content.split('\n').map((line, index) => (
                    <div key={index} className="content-line">
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReviews = () => (
        <div className="draft-reviews-section">
            {draft.reviews.map(review => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <div className="reviewer-info">
                            <span className="reviewer-name">{review.reviewer}</span>
                            <span className="review-date">{review.date}</span>
                        </div>
                        <div className="review-decision">
                            {review.decision === 'minor_revision' ? '建议小修' :
                                review.decision === 'major_revision' ? '建议大修' :
                                    review.decision === 'accept' ? '建议接受' : '建议拒绝'}
                        </div>
                    </div>

                    <div className="review-scores">
                        {Object.entries(review.score).map(([key, value]) => (
                            <div key={key} className="score-item">
                <span className="score-label">
                  {key === 'novelty' ? '创新性' :
                      key === 'quality' ? '质量' :
                          key === 'relevance' ? '相关性' : '清晰度'}
                </span>
                                <div className="score-bar">
                                    <div
                                        className="score-value"
                                        style={{ width: `${value * 10}%` }}
                                    >
                                        {value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="review-comments">
                        <h4>审稿意见</h4>
                        <pre className="comments-content">{review.comments}</pre>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderHistory = () => (
        <div className="draft-history-section">
            <div className="timeline">
                {draft.history.map((record, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-point" />
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <span className="timeline-date">{record.date}</span>
                                <span className="timeline-operator">{record.operator}</span>
                            </div>
                            <div className="timeline-details">
                                {record.details}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    if (!draft) {
        return <div className="error">稿件不存在</div>;
    }

    return (
        <div className="draft-detail">
            <div className="draft-header">
                <h2>{draft.title}</h2>
                <span className={`status-badge ${getStatusClass(draft.status)}`}>
          {getStatusText(draft.status)}
        </span>
            </div>

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    基本信息
                </button>
                <button
                    className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => setActiveTab('content')}
                >
                    稿件内容
                </button>
                <button
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    审稿意见
                </button>
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    操作历史
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'info' && renderInfo()}
                {activeTab === 'content' && renderContent()}
                {activeTab === 'reviews' && renderReviews()}
                {activeTab === 'history' && renderHistory()}
            </div>
        </div>
    );
};

export default DraftDetail;