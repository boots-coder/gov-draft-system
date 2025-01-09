import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/article-detail.css';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const ArticleDetail = () => {
    const { id } = useParams(); // 获取路由中的 `id` 参数
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchArticleDetails();
    }, [id]);

    const fetchArticleDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/article/${id}`);
            if (response.data.code === 200) {
                setArticle(response.data.data); // 设置文章数据
            }
        } catch (error) {
            console.error('获取稿件详情失败:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    if (!article) {
        return <div className="error">未找到稿件详情。</div>;
    }

    return (
        <div className="article-detail">
            <h2>{article.title || '文章标题'}</h2>
            <div className="article-info">
                <p><strong>提交人：</strong>{article.submitterName || '未知'}</p>
                <p><strong>提交时间：</strong>{new Date(article.submittedAt).toLocaleString('zh-CN')}</p>
                <p><strong>状态：</strong>{article.status}</p>
            </div>
            <div className="article-content">
                <h3>内容</h3>
                <p>{article.content || '暂无内容'}</p>
            </div>
            <button className="btn-back" onClick={() => window.history.back()}>
                返回
            </button>
        </div>
    );
};

export default ArticleDetail;